import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Query.module.css";
import { useState } from "react";
import { getExercises } from "../../services/exercises";


function Query() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

  const types = ["cardio", "plyometrics", "strength", "stretching"]
  const muscles = ["abdominals", "abductors", "adductors", "biceps",
    "calves", "chest", "forearms", "glutes", "hamstrings", "lats",
    "lower_back", "middle_back", "neck", "quadriceps", "traps", "triceps"]
  const difficulties = ["beginner", "intermediate", "expert"]

  const [selectedType, setSelectedType] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);

  const handleQueryButtonClick = async () => {
    if (selectedType || selectedMuscle || selectedDifficulty) {
      try {
        setError(null);
        const result = await getExercises({ type: selectedType, muscle: selectedMuscle, difficulty: selectedDifficulty });
        setExercises(result);
      } catch (error) {
        setError("Failed to fetch exercises.");
        console.error(error);
        setExercises([]);
      }
    } else {
      alert("Please select at least one filter option.");
    }

  }

  return (
    <div className={styles.query}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          Find an exercise,{" "}
          <span className={styles.nameHighlight}>{userName}</span>
        </div>
        <Navbar />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.queryBuilder}>
          <div className={styles.sectionTitle}>Build Your Exercise Query</div>
          <div className={styles.queryForm}>
            <div className={styles.filterSection}>
              <label className={styles.label}>Type</label>
                <select
                  className={styles.select}
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                >
                <option>Select type</option>
                {types.map(g => (
                <option key={g} value={g}>{g}</option>
                ))}
                </select>
            </div>
            <div className={styles.filterSection}>
              <label className={styles.label}>Muscle Group</label>
                <select
                  className={styles.select}
                  value={selectedMuscle}
                  onChange={e => setSelectedMuscle(e.target.value)}
                >
                <option>Select muscle group</option>
                {muscles.map(g => (
                <option key={g} value={g}>{g}</option>
                ))}
                </select>
            </div>
            <div className={styles.filterSection}>
              <label className={styles.label}>Difficulty</label>
                <select
                  className={styles.select}
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                >
                <option>Select difficulty</option>
                {difficulties.map(g => (
                <option key={g} value={g}>{g}</option>
                ))}
                </select>
            </div>
            <button className={styles.queryButton} onClick={handleQueryButtonClick}>Find Exercises</button>
          </div>
          <div className={styles.resultsArea}>
            {error && <div className={styles.error}>{error}</div>}
            {exercises.length === 0 && !error && (
              <div className={styles.placeholder}>
                Build your query above to see personalized workout recommendations
              </div>
            )}
            {exercises.length > 0 && (
              <ul className={styles.exerciseList}>
                {exercises.map((exercise, index) => (
                  <li key={exercise.id || index} className={styles.exerciseList}>
                    <div className={styles.exerciseName}>{exercise.name}</div>
                    <div><span className={styles.exercisePoint}>Equipment: </span>{exercise.equipment}</div>
                    <div><span className={styles.exercisePoint}>Instructions: </span>{exercise.instructions || "None"}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Query; 