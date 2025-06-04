import styles from "./DifficultySelector.module.css";
import SelectButton from "../SelectButton/SelectButton";

const format_label = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const DifficultySelector = ({ difficulties, selectedDifficulty, onSelect }) => (
  <div className={styles.difficulty}>
    <h3 className={styles.title}>Difficulty</h3>
    {difficulties.map((difficulty) => (
      <SelectButton
        key={difficulty}
        selected={selectedDifficulty === difficulty}
        onClick={() => onSelect(difficulty)}
      >
        {format_label(difficulty)}
      </SelectButton>
    ))}
  </div>
);

export default DifficultySelector;
