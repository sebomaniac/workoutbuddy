import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Query.module.css";

function Query() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

  return (
    <div className={styles.query}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          Find an exercise,{" "}
          <span className={styles.nameHighlight}>{userName}</span>
        </div>
        <Navbar />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.queryBuilder}>
          <div className={styles.sectionTitle}>Build Your Exercise Query</div>
          
          <div className={styles.queryForm}>
            <div className={styles.filterSection}>
              <label className={styles.label}>Exercise Type:</label>
              <select className={styles.select}>
                <option>Select exercise type...</option>
                <option>Strength Training</option>
                <option>Cardio</option>
                <option>Flexibility</option>
                <option>Balance</option>
              </select>
            </div>

            <div className={styles.filterSection}>
              <label className={styles.label}>Target Muscle Group:</label>
              <select className={styles.select}>
                <option>Select muscle group...</option>
                <option>Chest</option>
                <option>Back</option>
                <option>Legs</option>
                <option>Arms</option>
                <option>Core</option>
              </select>
            </div>

            <button className={styles.queryButton}>Find Exercise</button>
          </div>

          <div className={styles.resultsArea}>
            <div className={styles.placeholder}>
              Build your query above to see personalized workout recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Query; 