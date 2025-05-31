import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAllWorkoutPlans } from "../../services/workout";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // Default to today
  const [showDayWorkoutModal, setShowDayWorkoutModal] = useState(false);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setPlansLoading(true);
        const plans = await getAllWorkoutPlans();
        setWorkoutPlans(plans);
        setPlansError(null);
      } catch (error) {
        console.error("Error fetching workout plans:", error);
        setPlansError(error.message);
      } finally {
        setPlansLoading(false);
      }
    };

    if (user) {
      fetchWorkoutPlans();
    }
  }, [user]);

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

  // Get workout for selected day
  const getSelectedDayWorkout = () => {
    if (workoutPlans.length === 0) return null;
    
    // Find the most recent workout plan
    const latestPlan = workoutPlans[0]; // Assuming plans are sorted by creation date
    
    if (latestPlan && latestPlan.days) {
      const selectedDayWorkout = latestPlan.days.find(day => day.dayIndex === selectedDay);
      return { plan: latestPlan, workout: selectedDayWorkout };
    }
    
    return null;
  };

  const selectedDayWorkout = getSelectedDayWorkout();

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const closePlanModal = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const openDayWorkoutModal = () => {
    setShowDayWorkoutModal(true);
  };

  const closeDayWorkoutModal = () => {
    setShowDayWorkoutModal(false);
  };

  const formatExercise = (exercise) => {
    const parts = [];
    
    if (exercise.sets && exercise.reps) {
      parts.push(`${exercise.sets} sets × ${exercise.reps} reps`);
    }
    
    if (exercise.weight) {
      parts.push(`${exercise.weight} ${exercise.weightUnit || 'lbs'}`);
    }
    
    if (exercise.duration) {
      parts.push(`${exercise.duration} minutes`);
    }
    
    if (exercise.distance) {
      parts.push(`${exercise.distance} ${exercise.distanceUnit || 'km'}`);
    }
    
    if (exercise.restBetweenSets) {
      parts.push(`Rest: ${exercise.restBetweenSets}s`);
    }
    
    return parts.join(' • ');
  };

  const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || 'Unknown Day';
  };

  const handleCreateNewPlan = () => {
    navigate('/setup');
  };

  const handleDayChange = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const isToday = selectedDay === new Date().getDay();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          Welcome back,{" "}
          <span className={styles.nameHighlight}>{userName}</span>
        </div>
        <Navbar />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainColumn}>
            <div className={styles.mainColumnContent}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div className={styles.sectionTitle}>
                  {isToday ? "Today's Workout" : `${getDayName(selectedDay)}'s Workout`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px', opacity: 0.8 }}>View day:</span>
                  <select
                    value={selectedDay}
                    onChange={(e) => handleDayChange(parseInt(e.target.value))}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      outline: 'none',
                      minWidth: '120px'
                    }}
                  >
                    <option value={0} style={{ backgroundColor: '#333', color: 'white' }}>Sunday</option>
                    <option value={1} style={{ backgroundColor: '#333', color: 'white' }}>Monday</option>
                    <option value={2} style={{ backgroundColor: '#333', color: 'white' }}>Tuesday</option>
                    <option value={3} style={{ backgroundColor: '#333', color: 'white' }}>Wednesday</option>
                    <option value={4} style={{ backgroundColor: '#333', color: 'white' }}>Thursday</option>
                    <option value={5} style={{ backgroundColor: '#333', color: 'white' }}>Friday</option>
                    <option value={6} style={{ backgroundColor: '#333', color: 'white' }}>Saturday</option>
                  </select>
                  {!isToday && (
                    <button
                      onClick={() => setSelectedDay(new Date().getDay())}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      Today
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.workoutCard}>
                {plansLoading ? (
                  <div className={styles.workoutTitle}>Loading your workout plans...</div>
                ) : plansError ? (
                  <div>
                    <div className={styles.workoutTitle}>Error loading workout plans</div>
                    <div className={styles.workoutDescription}>{plansError}</div>
                  </div>
                ) : workoutPlans.length === 0 ? (
                  <div>
                    <div className={styles.workoutTitle}>No Workout Plans Yet</div>
                    <div className={styles.workoutDescription}>
                      Create your first workout plan to get started with your fitness journey!
                    </div>
                  </div>
                ) : selectedDayWorkout && selectedDayWorkout.workout ? (
                  <div>
                    <div className={styles.workoutTitle}>
                      {selectedDayWorkout.workout.dayName} - {selectedDayWorkout.plan.name}
                    </div>
                    {selectedDayWorkout.workout.isRestDay ? (
                      <div className={styles.workoutDescription}>
                        Rest Day - Take a break and let your muscles recover!
                      </div>
                    ) : (
                      <div className={styles.workoutDescription}>
                        {selectedDayWorkout.workout.exercises.length} exercises planned
                        {selectedDayWorkout.workout.exercises.length > 0 && (
                          <div style={{ marginTop: '10px', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span>Starting with: {selectedDayWorkout.workout.exercises[0].name}</span>
                            <button
                              onClick={openDayWorkoutModal}
                              style={{
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1976D2';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#2196F3';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.3)';
                              }}
                            >
                              View Full Workout
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className={styles.workoutTitle}>No Workout Scheduled for {getDayName(selectedDay)}</div>
                    <div className={styles.workoutDescription}>
                      Check your workout plans or create a new one to stay on track!
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.sectionTitle}>Your Workout Plan</div>
              <div className={styles.planContainer}>
                {plansLoading ? (
                  "Loading your workout plan..."
                ) : workoutPlans.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '15px', opacity: 0.8 }}>
                      No workout plan created yet
                    </div>
                    <div style={{ fontSize: '18px', opacity: 0.6 }}>
                      Create your first workout plan to get started with your fitness journey!
                    </div>
                  </div>
                ) : (
                  workoutPlans.slice(0, 1).map((plan) => (
                    <div 
                      key={plan._id} 
                      onClick={() => handlePlanClick(plan)}
                      style={{ 
                        fontSize: '25px', 
                        marginBottom: '15px',
                        padding: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.borderColor = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                    <strong>{plan.name}</strong>
                      <div style={{ fontSize: '20px', marginTop: '8px', opacity: 0.8 }}>
                        {plan.description || 'No description'}
                      </div>
                      <div style={{ fontSize: '18px', marginTop: '8px', opacity: 0.6 }}>
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                      {plan.days && (
                        <div style={{ fontSize: '16px', marginTop: '8px', opacity: 0.7 }}>
                          {plan.days.length} days scheduled
                        </div>
                      )}
                      <div style={{ fontSize: '16px', marginTop: '8px', opacity: 0.5, fontStyle: 'italic' }}>
                        Click to view full details
                      </div>
                    </div>
                  ))
                )}
                
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handleCreateNewPlan}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '15px 25px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#45a049';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4CAF50';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>+</span>
                    {workoutPlans.length === 0 ? 'Create Your First Workout Plan' : 'Generate New Workout Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
{/*

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
*/}
        </div>
      </div>

      {/* Workout Plan Detail Modal */}
      {showPlanModal && selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: '#fff' }}>{selectedPlan.name}</h2>
              <button 
                onClick={closePlanModal}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {selectedPlan.description && (
              <div style={{ fontSize: '18px', marginBottom: '20px', opacity: 0.8, fontStyle: 'italic' }}>
                {selectedPlan.description}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div style={{ padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                <strong>Created:</strong><br />
                {new Date(selectedPlan.createdAt).toLocaleDateString()}
              </div>
              {selectedPlan.startDate && (
                <div style={{ padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <strong>Start Date:</strong><br />
                  {new Date(selectedPlan.startDate).toLocaleDateString()}
                </div>
              )}
              <div style={{ padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                <strong>Total Days:</strong><br />
                {selectedPlan.days ? selectedPlan.days.length : 0}
              </div>
            </div>

            <h3 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', paddingBottom: '10px' }}>
              Weekly Schedule
            </h3>

            {selectedPlan.days && selectedPlan.days.length > 0 ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                {selectedPlan.days.map((day, index) => (
                  <div key={index} style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '10px', 
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h4 style={{ fontSize: '20px', marginBottom: '15px', color: '#4CAF50' }}>
                      {day.dayName || getDayName(day.dayIndex)} 
                      {day.isRestDay && ' (Rest Day)'}
                    </h4>

                    {day.isRestDay ? (
                      <div style={{ fontSize: '16px', opacity: 0.8, fontStyle: 'italic' }}>
                        Rest and recovery day - no exercises scheduled
                      </div>
                    ) : (
                      <>
                        {/* Warm Up Section */}
                        {day.warmUp && day.warmUp.exercises && day.warmUp.exercises.length > 0 && (
                          <div style={{ marginBottom: '15px' }}>
                            <h5 style={{ fontSize: '16px', color: '#FF9800', marginBottom: '10px' }}>
                              Warm Up {day.warmUp.totalDuration && `(${day.warmUp.totalDuration} min)`}
                            </h5>
                            {day.warmUp.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} style={{ marginLeft: '15px', marginBottom: '8px', fontSize: '14px' }}>
                                • <strong>{exercise.name}</strong> ({exercise.type})
                                {formatExercise(exercise) && <div style={{ marginLeft: '15px', opacity: 0.8 }}>{formatExercise(exercise)}</div>}
                                {exercise.notes && <div style={{ marginLeft: '15px', opacity: 0.6, fontStyle: 'italic' }}>Note: {exercise.notes}</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Main Exercises */}
                        {day.exercises && day.exercises.length > 0 && (
                          <div style={{ marginBottom: '15px' }}>
                            <h5 style={{ fontSize: '16px', color: '#2196F3', marginBottom: '10px' }}>
                              Main Exercises ({day.exercises.length})
                            </h5>
                            {day.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} style={{ 
                                marginLeft: '15px', 
                                marginBottom: '12px', 
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '5px',
                                borderLeft: '3px solid #2196F3'
                              }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                  {exIndex + 1}. {exercise.name} 
                                  <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', opacity: 0.7 }}>
                                    ({exercise.type})
                                  </span>
                                </div>
                                {formatExercise(exercise) && (
                                  <div style={{ marginTop: '5px', opacity: 0.9, fontSize: '14px' }}>
                                    {formatExercise(exercise)}
                                  </div>
                                )}
                                {exercise.notes && (
                                  <div style={{ marginTop: '5px', opacity: 0.7, fontStyle: 'italic', fontSize: '13px' }}>
                                    Note: {exercise.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Cool Down Section */}
                        {day.coolDown && day.coolDown.exercises && day.coolDown.exercises.length > 0 && (
                          <div style={{ marginBottom: '15px' }}>
                            <h5 style={{ fontSize: '16px', color: '#9C27B0', marginBottom: '10px' }}>
                              Cool Down {day.coolDown.totalDuration && `(${day.coolDown.totalDuration} min)`}
                            </h5>
                            {day.coolDown.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} style={{ marginLeft: '15px', marginBottom: '8px', fontSize: '14px' }}>
                                • <strong>{exercise.name}</strong> ({exercise.type})
                                {formatExercise(exercise) && <div style={{ marginLeft: '15px', opacity: 0.8 }}>{formatExercise(exercise)}</div>}
                                {exercise.notes && <div style={{ marginLeft: '15px', opacity: 0.6, fontStyle: 'italic' }}>Note: {exercise.notes}</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Day Notes */}
                        {day.notes && (
                          <div style={{ 
                            marginTop: '15px', 
                            padding: '10px', 
                            backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                            borderRadius: '5px',
                            borderLeft: '3px solid #FFC107'
                          }}>
                            <strong>Day Notes:</strong> {day.notes}
                          </div>
                        )}

                        {/* Show message if no exercises */}
                        {(!day.exercises || day.exercises.length === 0) && 
                         (!day.warmUp || !day.warmUp.exercises || day.warmUp.exercises.length === 0) &&
                         (!day.coolDown || !day.coolDown.exercises || day.coolDown.exercises.length === 0) && (
                          <div style={{ fontSize: '16px', opacity: 0.6, fontStyle: 'italic' }}>
                            No exercises scheduled for this day
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '18px', opacity: 0.6, textAlign: 'center', padding: '40px' }}>
                No workout days scheduled in this plan
              </div>
            )}
          </div>
        </div>
      )}

      {/* Day Workout Detail Modal */}
      {showDayWorkoutModal && selectedDayWorkout && selectedDayWorkout.workout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: '#fff' }}>
                {selectedDayWorkout.workout.dayName || getDayName(selectedDay)} Workout
              </h2>
              <button 
                onClick={closeDayWorkoutModal}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: '10px', borderLeft: '4px solid #4CAF50' }}>
              <strong>From Plan:</strong> {selectedDayWorkout.plan.name}
            </div>

            {selectedDayWorkout.workout.isRestDay ? (
              <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
                <div style={{ fontSize: '24px', marginBottom: '15px', opacity: 0.8 }}>
                  🛌 Rest Day
                </div>
                <div style={{ opacity: 0.7 }}>
                  Take a break and let your muscles recover!
                </div>
              </div>
            ) : (
              <div>
                {/* Warm Up Section */}
                {selectedDayWorkout.workout.warmUp && selectedDayWorkout.workout.warmUp.exercises && selectedDayWorkout.workout.warmUp.exercises.length > 0 && (
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '20px', color: '#FF9800', marginBottom: '15px', borderBottom: '2px solid #FF9800', paddingBottom: '5px' }}>
                      🔥 Warm Up {selectedDayWorkout.workout.warmUp.totalDuration && `(${selectedDayWorkout.workout.warmUp.totalDuration} min)`}
                    </h3>
                    {selectedDayWorkout.workout.warmUp.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} style={{ 
                        marginBottom: '15px', 
                        padding: '15px',
                        backgroundColor: 'rgba(255, 152, 0, 0.05)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #FF9800'
                      }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                          {exercise.name}
                          <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', opacity: 0.7 }}>
                            ({exercise.type})
                          </span>
                        </div>
                        {formatExercise(exercise) && (
                          <div style={{ marginBottom: '5px', opacity: 0.9, fontSize: '16px' }}>
                            {formatExercise(exercise)}
                          </div>
                        )}
                        {exercise.notes && (
                          <div style={{ opacity: 0.7, fontStyle: 'italic', fontSize: '14px' }}>
                            💡 {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Exercises */}
                {selectedDayWorkout.workout.exercises && selectedDayWorkout.workout.exercises.length > 0 && (
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '20px', color: '#2196F3', marginBottom: '15px', borderBottom: '2px solid #2196F3', paddingBottom: '5px' }}>
                      💪 Main Exercises ({selectedDayWorkout.workout.exercises.length})
                    </h3>
                    {selectedDayWorkout.workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} style={{ 
                        marginBottom: '20px', 
                        padding: '20px',
                        backgroundColor: 'rgba(33, 150, 243, 0.05)',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2196F3'
                      }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#2196F3' }}>
                          {exIndex + 1}. {exercise.name}
                          <span style={{ fontSize: '16px', fontWeight: 'normal', marginLeft: '10px', opacity: 0.7 }}>
                            ({exercise.type})
                          </span>
                        </div>
                        {formatExercise(exercise) && (
                          <div style={{ marginBottom: '10px', fontSize: '16px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '5px' }}>
                            📊 {formatExercise(exercise)}
                          </div>
                        )}
                        {exercise.notes && (
                          <div style={{ opacity: 0.8, fontStyle: 'italic', fontSize: '15px', padding: '8px', backgroundColor: 'rgba(255, 193, 7, 0.1)', borderRadius: '5px' }}>
                            💡 <strong>Note:</strong> {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cool Down Section */}
                {selectedDayWorkout.workout.coolDown && selectedDayWorkout.workout.coolDown.exercises && selectedDayWorkout.workout.coolDown.exercises.length > 0 && (
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '20px', color: '#9C27B0', marginBottom: '15px', borderBottom: '2px solid #9C27B0', paddingBottom: '5px' }}>
                      🧘 Cool Down {selectedDayWorkout.workout.coolDown.totalDuration && `(${selectedDayWorkout.workout.coolDown.totalDuration} min)`}
                    </h3>
                    {selectedDayWorkout.workout.coolDown.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} style={{ 
                        marginBottom: '15px', 
                        padding: '15px',
                        backgroundColor: 'rgba(156, 39, 176, 0.05)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #9C27B0'
                      }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                          {exercise.name}
                          <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', opacity: 0.7 }}>
                            ({exercise.type})
                          </span>
                        </div>
                        {formatExercise(exercise) && (
                          <div style={{ marginBottom: '5px', opacity: 0.9, fontSize: '16px' }}>
                            {formatExercise(exercise)}
                          </div>
                        )}
                        {exercise.notes && (
                          <div style={{ opacity: 0.7, fontStyle: 'italic', fontSize: '14px' }}>
                            💡 {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Day Notes */}
                {selectedDayWorkout.workout.notes && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                    borderRadius: '10px',
                    borderLeft: '4px solid #FFC107'
                  }}>
                    <strong style={{ fontSize: '16px' }}>📝 Day Notes:</strong>
                    <div style={{ marginTop: '8px', fontSize: '15px' }}>
                      {selectedDayWorkout.workout.notes}
                    </div>
                  </div>
                )}

                {/* Show message if no exercises */}
                {(!selectedDayWorkout.workout.exercises || selectedDayWorkout.workout.exercises.length === 0) && 
                 (!selectedDayWorkout.workout.warmUp || !selectedDayWorkout.workout.warmUp.exercises || selectedDayWorkout.workout.warmUp.exercises.length === 0) &&
                 (!selectedDayWorkout.workout.coolDown || !selectedDayWorkout.workout.coolDown.exercises || selectedDayWorkout.workout.coolDown.exercises.length === 0) && (
                  <div style={{ fontSize: '18px', opacity: 0.6, textAlign: 'center', padding: '40px' }}>
                    No exercises scheduled for this day
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
