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

  const [prompt, setPrompt] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);

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
      <div className={styles.page}>
        <div className={styles.setupCard}>
          <div className={styles.topContainer}>
            <h2 className={styles.title}>
              Plan Setup
            </h2>
            <p className={styles.setupInstructions}>Personalize your workout plan to achieve your fitness goals</p>
          </div>
          <div className={styles.upperContainer}>
            <div className={styles.upperLeftContainer}>
              <div className={styles.types}>
                <h3 className={styles.subtitle}>Workout Types</h3>
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
              <div className={styles.difficulty}>
                <h3 className={styles.subtitle}>Difficulty</h3>
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
            </div>
            <div className={styles.upperRightContainer}>
              <div className={styles.muscleGroup}>
                <h3 className={styles.subtitle}>Muscle Groups</h3>
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
          <div className={styles.advancedSettings}>
            <button
              className={styles.advancedButton}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Advanced Settings (Optional)
              <span
                className={`${styles.arrow} ${showAdvanced ? styles.arrowFlipped : ""}`}
              >
                ▼
              </span>
            </button>
            {showAdvanced && (
              <div className={styles.advancedOptions}>
                <div className={styles.lowerLeftContainer}>
                  <p>Age</p>
                  <input
                    placeholder="Enter age in years"
                    className={styles.advancedInput}
                  />
                  <p>Weight</p>
                  <input
                    placeholder="Enter weight in lbs"
                    className={styles.advancedInput}
                  />
                  <p>Height</p>
                  <input
                    placeholder="Enter height in inches"
                    className={styles.advancedInput}
                  />
                </div>
                <div className={styles.lowerRightContainer}>
                  <p>Benchpress PR</p>
                  <input
                    placeholder="Enter benchpress PR in lbs"
                    className={styles.advancedInput}
                  />
                  <p>Squat PR</p>
                  <input
                    placeholder="Enter squat PR in lbs"
                    className={styles.advancedInput}
                  />
                  <p>Deadlift PR</p>
                  <input
                    placeholder="Enter deadlift PR in lbs"
                    className={styles.advancedInput}
                  />
                  <p>Pull-Ups PR</p>
                  <input
                    placeholder="Enter pull-ups PR in reps"
                    className={styles.advancedInput}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={styles.promptContainer}>
            <h3 className={styles.subtitle}>Tell us about your goals</h3>
            <textarea
              className={styles.prompt}
              placeholder="Describe your fitness goals, background, and time commitment"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>
          <button className={styles.submitButton}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default PlanSetup;
