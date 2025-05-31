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
              <div className={styles.daySelectionContainer}>
                <div className={styles.sectionTitle}>
                  {isToday ? "Today's Workout" : `${getDayName(selectedDay)}'s Workout`}
                </div>
                <div className={styles.daySelectionControls}>
                  <span className={styles.daySelectionLabel}>View day:</span>
                  <select
                    value={selectedDay}
                    onChange={(e) => handleDayChange(parseInt(e.target.value))}
                    className={styles.daySelect}
                  >
                    <option value={0} className={styles.daySelectOption}>Sunday</option>
                    <option value={1} className={styles.daySelectOption}>Monday</option>
                    <option value={2} className={styles.daySelectOption}>Tuesday</option>
                    <option value={3} className={styles.daySelectOption}>Wednesday</option>
                    <option value={4} className={styles.daySelectOption}>Thursday</option>
                    <option value={5} className={styles.daySelectOption}>Friday</option>
                    <option value={6} className={styles.daySelectOption}>Saturday</option>
                  </select>
                  {!isToday && (
                    <button
                      onClick={() => setSelectedDay(new Date().getDay())}
                      className={styles.todayButton}
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
                          <div className={styles.workoutDescriptionWithButton}>
                            <span>Starting with: {selectedDayWorkout.workout.exercises[0].name}</span>
                            <button
                              onClick={openDayWorkoutModal}
                              className={styles.viewWorkoutButton}
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
                  <div className={styles.emptyPlansContainer}>
                    <div className={styles.emptyPlansTitle}>
                      No workout plan created yet
                    </div>
                    <div className={styles.emptyPlansDescription}>
                      Create your first workout plan to get started with your fitness journey!
                    </div>
                  </div>
                ) : (
                  workoutPlans.slice(0, 1).map((plan) => (
                    <div 
                      key={plan._id} 
                      onClick={() => handlePlanClick(plan)}
                      className={styles.planCard}
                    >
                    <strong>{plan.name}</strong>
                      <div className={styles.planCardDescription}>
                        {plan.description || 'No description'}
                      </div>
                      <div className={styles.planCardDate}>
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                      {plan.days && (
                        <div className={styles.planCardDays}>
                          {plan.days.length} days scheduled
                        </div>
                      )}
                      <div className={styles.planCardHint}>
                        Click to view full details
                      </div>
                    </div>
                  ))
                )}
                
                <div className={styles.createPlanButtonContainer}>
                  <button
                    onClick={handleCreateNewPlan}
                    className={styles.createPlanButton}
                  >
                    <span className={styles.createPlanButtonIcon}>+</span>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedPlan.name}</h2>
              <button 
                onClick={closePlanModal}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>

            {selectedPlan.description && (
              <div className={styles.modalDescription}>
                {selectedPlan.description}
              </div>
            )}

            <div className={styles.modalInfoGrid}>
              <div className={styles.modalInfoCard}>
                <strong>Created:</strong><br />
                {new Date(selectedPlan.createdAt).toLocaleDateString()}
              </div>
              {selectedPlan.startDate && (
                <div className={styles.modalInfoCard}>
                  <strong>Start Date:</strong><br />
                  {new Date(selectedPlan.startDate).toLocaleDateString()}
                </div>
              )}
              <div className={styles.modalInfoCard}>
                <strong>Total Days:</strong><br />
                {selectedPlan.days ? selectedPlan.days.length : 0}
              </div>
            </div>

            <h3 className={styles.modalSectionHeader}>
              Weekly Schedule
            </h3>

            {selectedPlan.days && selectedPlan.days.length > 0 ? (
              <div className={styles.modalDaysGrid}>
                {selectedPlan.days.map((day, index) => (
                  <div key={index} className={styles.modalDayCard}>
                    <h4 className={styles.modalDayTitle}>
                      {day.dayName || getDayName(day.dayIndex)} 
                      {day.isRestDay && ' (Rest Day)'}
                    </h4>

                    {day.isRestDay ? (
                      <div className={styles.modalRestDay}>
                        Rest and recovery day - no exercises scheduled
                      </div>
                    ) : (
                      <>
                        {/* Warm Up Section */}
                        {day.warmUp && day.warmUp.exercises && day.warmUp.exercises.length > 0 && (
                          <div className={styles.modalExerciseSection}>
                            <h5 className={`${styles.modalExerciseSectionTitle} ${styles.modalExerciseSectionTitleWarmup}`}>
                              Warm Up {day.warmUp.totalDuration && `(${day.warmUp.totalDuration} min)`}
                            </h5>
                            {day.warmUp.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} className={styles.modalExerciseItem}>
                                • <strong>{exercise.name}</strong> ({exercise.type})
                                {formatExercise(exercise) && <div className={styles.modalExerciseNotes}>{formatExercise(exercise)}</div>}
                                {exercise.notes && <div className={styles.modalExerciseNotes}>Note: {exercise.notes}</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Main Exercises */}
                        {day.exercises && day.exercises.length > 0 && (
                          <div className={styles.modalExerciseSection}>
                            <h5 className={`${styles.modalExerciseSectionTitle} ${styles.modalExerciseSectionTitleMain}`}>
                              Main Exercises ({day.exercises.length})
                            </h5>
                            {day.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} className={styles.modalExerciseItemMain}>
                                <div className={styles.modalExerciseName}>
                                  {exIndex + 1}. {exercise.name} 
                                  <span className={styles.modalExerciseType}>
                                    ({exercise.type})
                                  </span>
                                </div>
                                {formatExercise(exercise) && (
                                  <div className={styles.modalExerciseDetailsMain}>
                                    {formatExercise(exercise)}
                                  </div>
                                )}
                                {exercise.notes && (
                                  <div className={styles.modalExerciseNotesMain}>
                                    Note: {exercise.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Cool Down Section */}
                        {day.coolDown && day.coolDown.exercises && day.coolDown.exercises.length > 0 && (
                          <div className={styles.modalExerciseSection}>
                            <h5 className={`${styles.modalExerciseSectionTitle} ${styles.modalExerciseSectionTitleCooldown}`}>
                              Cool Down {day.coolDown.totalDuration && `(${day.coolDown.totalDuration} min)`}
                            </h5>
                            {day.coolDown.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} className={styles.modalExerciseItem}>
                                • <strong>{exercise.name}</strong> ({exercise.type})
                                {formatExercise(exercise) && <div className={styles.modalExerciseNotes}>{formatExercise(exercise)}</div>}
                                {exercise.notes && <div className={styles.modalExerciseNotes}>Note: {exercise.notes}</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Day Notes */}
                        {day.notes && (
                          <div className={styles.modalDayNotes}>
                            <strong>Day Notes:</strong> {day.notes}
                          </div>
                        )}

                        {/* Show message if no exercises */}
                        {(!day.exercises || day.exercises.length === 0) && 
                         (!day.warmUp || !day.warmUp.exercises || day.warmUp.exercises.length === 0) &&
                         (!day.coolDown || !day.coolDown.exercises || day.coolDown.exercises.length === 0) && (
                          <div className={styles.modalEmptyDay}>
                            No exercises scheduled for this day
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.modalEmptyPlan}>
                No workout days scheduled in this plan
              </div>
            )}
          </div>
        </div>
      )}

      {/* Day Workout Detail Modal */}
      {showDayWorkoutModal && selectedDayWorkout && selectedDayWorkout.workout && (
        <div className={styles.modalOverlay}>
          <div className={styles.dayWorkoutModalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedDayWorkout.workout.dayName || getDayName(selectedDay)} Workout
              </h2>
              <button 
                onClick={closeDayWorkoutModal}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>

            <div className={styles.dayWorkoutPlanInfo}>
              <strong>From Plan:</strong> {selectedDayWorkout.plan.name}
            </div>

            {selectedDayWorkout.workout.isRestDay ? (
              <div className={styles.dayWorkoutRestDay}>
                <div className={styles.dayWorkoutRestDayTitle}>
                  🛌 Rest Day
                </div>
                <div className={styles.dayWorkoutRestDayMessage}>
                  Take a break and let your muscles recover!
                </div>
              </div>
            ) : (
              <div>
                {/* Warm Up Section */}
                {selectedDayWorkout.workout.warmUp && selectedDayWorkout.workout.warmUp.exercises && selectedDayWorkout.workout.warmUp.exercises.length > 0 && (
                  <div className={styles.dayWorkoutSection}>
                    <h3 className={`${styles.dayWorkoutSectionTitle} ${styles.dayWorkoutSectionTitleWarmup}`}>
                      🔥 Warm Up {selectedDayWorkout.workout.warmUp.totalDuration && `(${selectedDayWorkout.workout.warmUp.totalDuration} min)`}
                    </h3>
                    {selectedDayWorkout.workout.warmUp.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className={`${styles.dayWorkoutExerciseCard} ${styles.dayWorkoutExerciseCardWarmup}`}>
                        <div className={styles.dayWorkoutExerciseName}>
                          {exercise.name}
                          <span className={styles.dayWorkoutExerciseType}>
                            ({exercise.type})
                          </span>
                        </div>
                        {formatExercise(exercise) && (
                          <div className={styles.dayWorkoutExerciseDetails}>
                            {formatExercise(exercise)}
                          </div>
                        )}
                        {exercise.notes && (
                          <div className={styles.dayWorkoutExerciseNotes}>
                            💡 {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Exercises */}
                {selectedDayWorkout.workout.exercises && selectedDayWorkout.workout.exercises.length > 0 && (
                  <div className={styles.dayWorkoutSection}>
                    <h3 className={`${styles.dayWorkoutSectionTitle} ${styles.dayWorkoutSectionTitleMain}`}>
                      💪 Main Exercises ({selectedDayWorkout.workout.exercises.length})
                    </h3>
                    {selectedDayWorkout.workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className={styles.dayWorkoutExerciseCardMain}>
                        <div className={styles.dayWorkoutExerciseNameMain}>
                          {exIndex + 1}. {exercise.name}
                          <span className={styles.dayWorkoutExerciseTypeMain}>
                            ({exercise.type})
                          </span>
                        </div>
                        {formatExercise(exercise) && (
                          <div className={styles.dayWorkoutExerciseDetailsMain}>
                            📊 {formatExercise(exercise)}
                          </div>
                        )}
                        {exercise.notes && (
                          <div className={styles.dayWorkoutExerciseNotesMain}>
                            💡 <strong>Note:</strong> {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cool Down Section */}
                {selectedDayWorkout.workout.coolDown && selectedDayWorkout.workout.coolDown.exercises && selectedDayWorkout.workout.coolDown.exercises.length > 0 && (
                  <div className={styles.dayWorkoutSection}>
                    <h3 className={`${styles.dayWorkoutSectionTitle} ${styles.dayWorkoutSectionTitleCooldown}`}>
                      🧘 Cool Down {selectedDayWorkout.workout.coolDown.totalDuration && `(${selectedDayWorkout.workout.coolDown.totalDuration} min)`}
                    </h3>
                    {selectedDayWorkout.workout.coolDown.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className={`${styles.dayWorkoutExerciseCard} ${styles.dayWorkoutExerciseCardCooldown}`}>
                        <div className={styles.dayWorkoutExerciseName}>
                          {exercise.name}
                          <span className={styles.dayWorkoutExerciseType}>
                            ({exercise.type})
                          </span>
                        </div>
                        {formatExercise(exercise) && (
                          <div className={styles.dayWorkoutExerciseDetails}>
                            {formatExercise(exercise)}
                          </div>
                        )}
                        {exercise.notes && (
                          <div className={styles.dayWorkoutExerciseNotes}>
                            💡 {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Day Notes */}
                {selectedDayWorkout.workout.notes && (
                  <div className={styles.dayWorkoutDayNotes}>
                    <strong className={styles.dayWorkoutDayNotesTitle}>📝 Day Notes:</strong>
                    <div className={styles.dayWorkoutDayNotesContent}>
                      {selectedDayWorkout.workout.notes}
                    </div>
                  </div>
                )}

                {/* Show message if no exercises */}
                {(!selectedDayWorkout.workout.exercises || selectedDayWorkout.workout.exercises.length === 0) && 
                 (!selectedDayWorkout.workout.warmUp || !selectedDayWorkout.workout.warmUp.exercises || selectedDayWorkout.workout.warmUp.exercises.length === 0) &&
                 (!selectedDayWorkout.workout.coolDown || !selectedDayWorkout.workout.coolDown.exercises || selectedDayWorkout.workout.coolDown.exercises.length === 0) && (
                  <div className={styles.dayWorkoutEmptyMessage}>
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
