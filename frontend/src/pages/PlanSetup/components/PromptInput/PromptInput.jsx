import styles from './PromptInput.module.css';

const PromptInput = ({ title, prompt, onChange }) => (
  <div className={styles.types}>
    <h3 className={styles.title}>{title}</h3>
    <textarea
      id="prompt"
      className={styles.prompt}
      placeholder="Describe your fitness goals, background, and time commitment"
      value={prompt}
      onChange={onChange}
      rows={3}
    />
  </div>
);

export default PromptInput
