import ParticlesBackground from "../../components/ParticlesBackground";
import styles from "./PlanSetup.module.css";
import { useState } from "react";

const PlanSetup = () => {
  const types = ["cardio", "plyometrics", "strength", "stretching"]
  const muscles = ["abdominals", "abductors", "adductors", "biceps",
    "calves", "chest", "forearms", "glutes", "hamstrings", "lats",
    "lower_back", "middle_back", "neck", "quadriceps", "traps", "triceps"]
  const difficulties = ["beginner", "intermediate", "expert"]

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  function handleTypeSelection(type) {
    const newTypes = selectedTypes.slice();
    if (! newTypes.includes(type)) {
      newTypes.push(type);
      setSelectedTypes(newTypes);
    }
    else {
      newTypes.splice(newTypes.indexOf(type), 1);
      setSelectedTypes(newTypes);
    }
    console.log("Selected types:", newTypes);
  }

  function handleMuscleSelection(muscle) {
    const newMuscles = selectedMuscles.slice();
    if (!newMuscles.includes(muscle)) {
      newMuscles.push(muscle);
      setSelectedMuscles(newMuscles);
    } else {
      newMuscles.splice(newMuscles.indexOf(muscle), 1);
      setSelectedMuscles(newMuscles);
    }
    console.log("Selected muscles:", newMuscles);
  }

  function handleDifficultySelection(difficulty) {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty("");
    } else {
      setSelectedDifficulty(difficulty);
    }
    console.log("Selected difficulty:", selectedDifficulty);
  }

  return (
    <>
      <h1 className={styles.title}>Plan Setup</h1>
      <div className={styles.upperContainer}>
        <div className={styles.typesContainer}>
          <div className={styles.types}>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className={`${styles.button} ${selectedTypes.includes(type) ? styles.selected : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.musclesContainer}>
          <div className={styles.muscleGroup}>
            {muscles.map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleSelection(muscle)}
                className={`${styles.button} ${selectedMuscles.includes(muscle) ? styles.selected : ""}`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className={styles.difficulty}>
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleDifficultySelection(difficulty)}
            className={`${styles.button} ${selectedDifficulty === difficulty ? styles.selected : ""}`}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </>
  );
};

export default PlanSetup;
