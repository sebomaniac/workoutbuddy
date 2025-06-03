import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import AdvancedSettings from "./components/AdvancedSettings/AdvancedSettings";
import Navbar from "../../components/Navbar/Navbar";
import { fetchSettings, saveSettings } from "../../services/settings";
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
      
      await saveSettings(settingsData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await fetchSettings();
        const settings = result.settings || {};
        
        setGender(settings.gender || '');
        setAge(settings.age ? settings.age.toString() : '');
        setWeight(settings.weight ? settings.weight.toString() : '');
        setHeight(settings.height ? settings.height.toString() : '');
        setBenchpressPR(settings.benchpressPR ? settings.benchpressPR.toString() : '');
        setSquatPR(settings.squatPR ? settings.squatPR.toString() : '');
        setDeadliftPR(settings.deadliftPR ? settings.deadliftPR.toString() : '');
        setPullUpsPR(settings.pullUpsPR ? settings.pullUpsPR.toString() : '');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    if (user) {
      loadSettings();
    }
  }, [user]);

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