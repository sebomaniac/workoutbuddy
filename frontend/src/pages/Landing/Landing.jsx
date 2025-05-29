import Logo from "../../components/Logo/Logo";
import Button from "../../components/Buttons/Button";
import styles from "./Landing.module.css";
import { Link } from "react-router-dom";
import ParticlesBackground from "../../components/ParticlesBackground";

const Landing = () => {
  return (
    <>
      <ParticlesBackground />
      <div className={styles.nav}>
        <Logo />
        <Link to="/signup" className="underline-animated">
          Sign Up
        </Link>
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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://web.cs.ucla.edu/classes/spring25/cs35L/project.html"
          className="underline-animated"
        >
          CS35L Final Project
        </a>
        <div className={styles.groupMemberEffect}>
          <p className={styles.groupMemberToggle}>Group Members</p>
          <p className={styles.groupMemberNames}>
            Lavender Hwang&nbsp;&nbsp;&nbsp;&nbsp;Sebastian
            Johannessen&nbsp;&nbsp;&nbsp;&nbsp;Mark
            Mairs&nbsp;&nbsp;&nbsp;&nbsp;Kian Shandi&nbsp;&nbsp;&nbsp;&nbsp;
            Daniel Zhou
          </p>
        </div>
      </div>
    </>
  );
};
export default Landing;
