import styles from "./SelectButton.module.css";

const SelectButton = ({ selected, onClick, children }) => (
  <button
    className={`${styles.button} ${selected ? styles.selected : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default SelectButton;