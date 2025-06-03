import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import AdvancedSettings from "./components/AdvancedSettings/AdvancedSettings";
import Navbar from "../../components/Navbar/Navbar";
import styles from './Settings.module.css';

const Settings = () => {
  const { user, loading } = useAuth();
    
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  const [benchpressPR, setBenchpressPR] = useState('');
  const [squatPR, setSquatPR] = useState('');
  const [deadliftPR, setDeadliftPR] = useState('');
  const [pullUpsPR, setPullUpsPR] = useState('');
  
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  
  const handleSaveSettings = async () => {
    try {
      const settingsData = {
        gender,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        benchpressPR: benchpressPR ? parseFloat(benchpressPR) : null,
        squatPR: squatPR ? parseFloat(squatPR) : null,
        deadliftPR: deadliftPR ? parseFloat(deadliftPR) : null,
        pullUpsPR: pullUpsPR ? parseInt(pullUpsPR) : null,
      };
      
      // TODO: Add API call to save settings to backend
      console.log('Saving settings:', settingsData);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };
  
  // Load settings on component mount
  useEffect(() => {
    // TODO: Add API call to load existing settings from backend
    const loadSettings = async () => {
      try {
        // Placeholder for loading settings
        console.log('Loading user settings...');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          Settings,{" "}
          <span className={styles.nameHighlight}>{userName}</span>
        </div>
        <Navbar />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.settingsContainer}>
          <div className={styles.sectionTitle}>Personalize Your Experience</div>
          
          <div className={styles.settingsCard}>
            <AdvancedSettings
              gender={gender}
              setGender={setGender}
              age={age}
              setAge={setAge}
              weight={weight}
              setWeight={setWeight}
              height={height}
              setHeight={setHeight}
              benchpressPR={benchpressPR}
              setBenchpressPR={setBenchpressPR}
              squatPR={squatPR}
              setSquatPR={setSquatPR}
              deadliftPR={deadliftPR}
              setDeadliftPR={setDeadliftPR}
              pullUpsPR={pullUpsPR}
              setPullUpsPR={setPullUpsPR}
              genders={genders}
            />
            
            <div className={styles.saveButtonContainer}>
              <button
                onClick={handleSaveSettings}
                className={styles.saveButton}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;