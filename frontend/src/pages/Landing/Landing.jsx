import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import styles from "./Landing.module.css";
import { Link } from "react-router-dom";
import ParticlesBackground from "../../components/ParticlesBackground";

const Landing = () => {
  return (
    <>
      <ParticlesBackground />
      <div className={styles.nav}>
        <Logo />
        <a>Sign Up</a>
      </div>
      <div className={styles.body}>
        <h1 className={styles.tagline}>
          train smarter, <span>not harder</span>
        </h1>
        <h3 className={styles.motto}>AI powered workouts, tailored for you</h3>
        <Link to="/signup">
          <Button text="Get Started" />
        </Link>
      </div>
      <div className={styles.footer}>
        <a href="https://web.cs.ucla.edu/classes/spring25/cs35L/project.html">
          CS35L Final Project
        </a>
        <p>Group Members</p>
      </div>
    </>
  );
};
export default Landing;
