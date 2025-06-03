import { motion } from "framer-motion";
import ParticlesBackground from "../../components/ParticlesBackground";
import styles from "./PlanSetup.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MultipleSelector from "./components/MultipleSelector/MultipleSelector";
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import PromptInput from "./components/PromptInput/PromptInput";
import { generateWorkoutPlan } from "../../services/workout";
import { fetchSettings } from "../../services/settings";

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

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [benchpressPR, setBenchpressPR] = useState("");
  const [squatPR, setSquatPR] = useState("");
  const [deadliftPR, setDeadliftPR] = useState("");
  const [pullUpsPR, setPullUpsPR] = useState("");

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [weightUnit, setWeightUnit] = useState("lbs");

  const navigate = useNavigate();

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
  }

  function handleDifficultySelection(difficulty) {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty("");
    } else {
      setSelectedDifficulty(difficulty);
    }
  }

  async function handleSubmit() {
    if (selectedTypes.length === 0) {
      alert("Please select at least one workout type.");
      return;
    }
    if (selectedMuscles.length === 0) {
      alert("Please select at least one muscle group.");
      return;
    }
    if (selectedDifficulty === "") {
      alert("Please select a difficulty level.");
      return;
    }
    if (prompt.trim() === "") {
      alert("Please describe your fitness goals.");
      return;
    }

    if (age) {
      if (age < 0 || age > 120) {
        alert("Please enter a valid age");
        return;
      }
    }

    if (weight) {
      if (weight < 0 || weight > 1000) {
        alert("Please enter a valid weight");
        return;
      }
    }
    if (height) {
      if (height < 0 || height > 120) {
        alert("Please enter a valid height");
        return;
      }
    }
    if (benchpressPR) {
      if (benchpressPR < 0 || benchpressPR > 1000) {
        alert("Please enter a valid benchpress PR");
        return;
      }
    }
    if (squatPR) {
      if (squatPR < 0 || squatPR > 1000) {
        alert("Please enter a valid squat PR");
        return;
      }
    }
    if (deadliftPR) {
      if (deadliftPR < 0 || deadliftPR > 1000) {
        alert("Please enter a valid deadlift PR");
        return;
      }
    }
    if (pullUpsPR) {
      if (pullUpsPR < 0 || pullUpsPR > 1000) {
        alert("Please enter a valid pull-ups PR");
        return;
      }
    }

    setIsGenerating(true);

    const settings = await fetchSettings();

    try {
      const planData = {
        selectedTypes,
        selectedMuscles,
        selectedDifficulty,
        prompt,
        gender: gender || undefined,
        age: settings.age || undefined,
        weight: settings.weight || undefined,
        height: settings.height || undefined,
        benchpressPR: settings.benchpressPR || undefined,
        squatPR: settings.squatPR || undefined,
        deadliftPR: settings.deadliftPR || undefined,
        pullUpsPR: settings.pullUpsPR || undefined,
        weightUnit,
      };

      const generatedPlan = await generateWorkoutPlan(planData);
      
      console.log("Workout plan generated successfully:", generatedPlan);
      alert("Workout plan generated successfully! Redirecting to your dashboard...");
      
      // Navigate to dashboard page
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error generating workout plan:", error);
      
      let errorMessage = "Failed to generate workout plan. Please try again.";
      
      if (error.message.includes("No authentication token")) {
        errorMessage = "Please log in to generate a workout plan.";
        navigate("/login");
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <div className={styles.page}>
        <motion.div
          className={styles.setupCard}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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
              <div className={styles.weightUnitRow}>
                <label htmlFor="weightUnit" className={styles.weightUnitLabel}>Weight Unit:</label>
                <select
                  id="weightUnit"
                  value={weightUnit}
                  onChange={e => setWeightUnit(e.target.value)}
                  className={styles.weightUnitSelect}
                >
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>
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
            <PromptInput
              title="Tell us about your goals"
              prompt={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button 
            className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating Plan..." : "Submit"}
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default PlanSetup;
