import styles from "./OnboardingForm.module.css";
import ParticlesBackground from "../../components/ParticlesBackground";

const OnboardingForm = ({ type }) => {
  return (
    <>
      <ParticlesBackground />
      <form action="" className={styles.form}>
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Password" />
        <button type="submit">{type}</button>
      </form>
    </>
  );
};
export default OnboardingForm;
