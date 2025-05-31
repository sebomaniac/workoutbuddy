import styles from "./OnboardingForm.module.css";
import ParticlesBackground from "../../components/ParticlesBackground";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const OnboardingForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  
  const { login, signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    clearError();

    try {
      let result;
      if (type === "Log In") {
        result = await login({ email, password });
      } else {
        result = await signup({ name, email, password });
      }

      if (result.success) {
        navigate("/dashboard");
      } else {
        setFormError(result.error || `${type} failed`);
      }
    } catch (err) {
      setFormError(err.message || `${type} failed`);
    }
  };

  const displayError = formError || error;

  return (
    <>
      <ParticlesBackground />
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>{type}</h1>
          
          {displayError && (
            <div className={styles.errorMessage}>
              {displayError}
            </div>
          )}
          
          {type === "Sign Up" && (
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button 
            className={styles.submit} 
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : type}
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
