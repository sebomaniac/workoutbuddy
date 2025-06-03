import styles from './AdvancedSettings.module.css';

const AdvancedSettings = ({
  gender, setGender,
  age, setAge,
  weight, setWeight,
  height, setHeight,
  benchpressPR, setBenchpressPR,
  squatPR, setSquatPR,
  deadliftPR, setDeadliftPR,
  pullUpsPR, setPullUpsPR,
  genders
}) => (
      <div className={styles.settingsContainer}>
        <div className={styles.leftContainer}>
          <label className={styles.label}>
            Gender
            <select
              className={styles.input}
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option>Select gender</option>
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Age
            <input
              type="number"
              placeholder="Enter age in years"
              className={styles.input}
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Weight
            <input
              type="number"
              placeholder="Enter weight in lbs"
              className={styles.input}
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Height
            <input
              type="number"
              placeholder="Enter height in inches"
              className={styles.input}
              value={height}
              onChange={e => setHeight(e.target.value)}
            />
          </label>
        </div>
        <div className={styles.rightContainer}>
          <label className={styles.label}>
            Benchpress PR
            <input
              type="number"
              placeholder="Enter benchpress PR in lbs"
              className={styles.input}
              value={benchpressPR}
              onChange={e => setBenchpressPR(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Squat PR
            <input
              type="number"
              placeholder="Enter squat PR in lbs"
              className={styles.input}
              value={squatPR}
              onChange={e => setSquatPR(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Deadlift PR
            <input
              type="number"
              placeholder="Enter deadlift PR in lbs"
              className={styles.input}
              value={deadliftPR}
              onChange={e => setDeadliftPR(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Pull-Ups PR
            <input
              type="number"
              placeholder="Enter pull-ups PR in reps"
              className={styles.input}
              value={pullUpsPR}
              onChange={e => setPullUpsPR(e.target.value)}
            />
          </label>
        </div>
      </div>
);

export default AdvancedSettings;