import styles from "./OnboardingForm.module.css";
import ParticlesBackground from "../../components/ParticlesBackground";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../../services/auth";
import { useState } from "react";

const OnboardingForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      alert("Login successful");
      navigate("/dashboard");
    } else {
      alert(res.error || "Login failed");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const res = await signup({ name, email, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      alert("Signup successful");
      navigate("/dashboard");
    } else {
      alert(res.error || "Signup failed");
    }
  }

  return (
    <>
      <ParticlesBackground />
      <div className={styles.formContainer}>
        <form
          onSubmit={type === "Log In" ? handleLogin : handleSignup}
          className={styles.form}
        >
          <h1 className={styles.title}>{type}</h1>
          {type === "Sign Up" && (
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={styles.submit} type="submit">
            {type}
          </button>
          {type === "Log In" ? (
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
