import styles from "./MultipleSelector.module.css";
import SelectButton from "../SelectButton/SelectButton";

const format_label = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const MultipleSelector = ({ title, types, selectedTypes, onSelect }) => (
  <div className={styles.types}>
    <h3 className={styles.title}>{title}</h3>
    {types.map((type) => (
      <SelectButton
        key={type}
        selected={selectedTypes.includes(type)}
        onClick={() => onSelect(type)}
      >
        {format_label(type)}
      </SelectButton>
    ))}
  </div>
);

export default MultipleSelector;
