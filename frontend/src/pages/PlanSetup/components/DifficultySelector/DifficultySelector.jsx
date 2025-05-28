import styles from "./DifficultySelector.module.css";
import SelectButton from "../SelectButton/SelectButton";

const DifficultySelector = ({ difficulties, selectedDifficulty, onSelect }) => (
  <div className={styles.difficulty}>
    <h3 className={styles.title}>Difficulty</h3>
    {difficulties.map((difficulty) => (
      <SelectButton
        key={difficulty}
        selected={selectedDifficulty === difficulty}
        onClick={() => onSelect(difficulty)}
      >
        {difficulty}
      </SelectButton>
    ))}
  </div>
);

export default DifficultySelector;
