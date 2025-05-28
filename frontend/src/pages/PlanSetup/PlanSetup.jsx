import ParticlesBackground from "../../components/ParticlesBackground";
import styles from "./PlanSetup.module.css";
import { useState } from "react";
import MultipleSelector from "./components/MultipleSelector/MultipleSelector";
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import PromptInput from "./components/PromptInput/PromptInput";

const PlanSetup = () => {
  const types = ["cardio", "plyometrics", "strength", "stretching"]
  const muscles = ["abdominals", "abductors", "adductors", "biceps",
    "calves", "chest", "forearms", "glutes", "hamstrings", "lats",
    "lower_back", "middle_back", "neck", "quadriceps", "traps", "triceps"]
  const difficulties = ["beginner", "intermediate", "expert"]
  const genders = ["male", 'female', 'non-binary', 'other']

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [selectedGender, setSelectedGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [benchpressPR, setBenchpressPR] = useState("");
  const [squatPR, setSquatPR] = useState("");
  const [deadliftPR, setDeadliftPR] = useState("");
  const [pullUpsPR, setPullUpsPR] = useState("");

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
              <MultipleSelector
                title="Workout Types"
                types={types}
                selectedTypes={selectedTypes}
                onSelect={handleTypeSelection}
              />
              <DifficultySelector
                difficulties={difficulties}
                selectedDifficulty={selectedDifficulty}
                onSelect={handleDifficultySelection}
              />
            </div>
            <div className={styles.upperRightContainer}>
              <MultipleSelector
                title="Muscle Groups"
                types={muscles}
                selectedTypes={selectedMuscles}
                onSelect={handleMuscleSelection}
              />
            </div>
          </div>
          <div className={styles.lowerContainer}>
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

            <PromptInput
              title="Tell us about your goals"
              prompt={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button className={styles.submitButton}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default PlanSetup;
