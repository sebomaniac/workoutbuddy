import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          Welcome back,{" "}
          <span className={styles.nameHighlight}>{userName}</span>
        </div>
        <div className={styles.navigation}>
          <div>Chat</div>
          <div>Dashboard</div>
          <div>Query</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainColumn}>
            <div className={styles.mainColumnContent}>
              <div className={styles.sectionTitle}>Today's Workout</div>
              <div className={styles.workoutCard}>
                <div className={styles.workoutTitle}>
                  Today's workout, include things like:
                </div>
                <div className={styles.workoutDescription}>
                  Workouts/machines with recommended sets & rep range
                  <br />
                  as well as weight
                </div>
              </div>

              <div className={styles.sectionTitle}>Progress Summary</div>
              <div className={styles.graphContainer}>graph goes here</div>
            </div>
          </div>

          <div className={styles.statsColumn}>
            <div className={styles.statsContent}>
              <div className={styles.sectionTitle}>My Stats</div>
              <div className={`${styles.statCard} ${styles.weeklyStreak}`}>
                weekly streak
              </div>
              <div className={`${styles.statCard} ${styles.maxStat}`}>
                max smt
              </div>
              <div className={`${styles.statCard} ${styles.workoutDuration}`}>
                avg workout duration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
