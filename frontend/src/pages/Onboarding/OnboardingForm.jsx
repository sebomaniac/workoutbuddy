import styles from "./OnboardingForm.module.css";
import ParticlesBackground from "../../components/ParticlesBackground";
import { Link } from "react-router-dom";

const OnboardingForm = ({ type }) => {
  return (
    <>
      <ParticlesBackground />
      <div className={styles.formContainer}>
        <form action="" className={styles.form}>
          <h1 className={styles.title}>{type}</h1>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <button className={styles.submit} type="submit">
            {type}
          </button>
          {type == "Log In" ? (
            <Link className={styles.link} to="/signup">
              Don't have an account? Sign Up
            </Link>
          ) : (
            <Link className={styles.link} to="/login">
              Already have an account? Log In
            </Link>
          )}
        </form>
      </div>
    </>
  );
};
export default OnboardingForm;
