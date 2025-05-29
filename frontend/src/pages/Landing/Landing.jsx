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
            <a href="https://github.com/lavenderhwang" target="_blank" rel="noopener noreferrer" className="underline-animated">Lavender Hwang</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/sebomaniac" target="_blank" rel="noopener noreferrer" className="underline-animated">Sebastian Johannessen</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/markmairs" target="_blank" rel="noopener noreferrer" className="underline-animated">Mark Mairs</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/kiankian" target="_blank" rel="noopener noreferrer" className="underline-animated">Kian Shandi</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/danielhzhou" target="_blank" rel="noopener noreferrer" className="underline-animated">Daniel Zhou</a>
          </p>
        </div>
      </div>
    </>
  );
};
export default Landing;
