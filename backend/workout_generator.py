import os
from google import genai
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Exercise(BaseModel):
    name: str
    type: str  # 'strength', 'cardio', 'mobility'
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    weightUnit: Optional[str] = None  # 'lbs', 'kg'
    duration: Optional[int] = None  # in seconds
    distance: Optional[float] = None
    distanceUnit: Optional[str] = None  # 'm', 'km', 'mi'
    restBetweenSets: Optional[int] = None  # in seconds
    notes: Optional[str] = None

class TimedSection(BaseModel):
    exercises: List[Exercise]
    totalDuration: Optional[int] = None  # in seconds

class Day(BaseModel):
    dayIndex: int  # 0-6 (Sunday-Saturday)
    dayName: str
    isRestDay: bool = False
    warmUp: Optional[TimedSection] = None
    exercises: List[Exercise] = []
    coolDown: Optional[TimedSection] = None
    notes: Optional[str] = None

class WorkoutPlan(BaseModel):
    name: str
    description: str
    days: List[Day]

class WorkoutGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Google API key is required. Set GEMINI_API_KEY environment variable or pass it directly.")
        self.client = genai.Client(api_key=self.api_key)
    
    def generate_workout_plan(
        self,
        selected_types: List[str],
        selected_muscles: List[str],
        difficulty: str,
        prompt: str,
        gender: str = None,
        age: int = None,
        weight: float = None,
        height: float = None,
        bench_press_pr: float = None,
        squat_pr: float = None,
        deadlift_pr: float = None,
        pull_ups_pr: int = None
    ) -> WorkoutPlan:
        """
        Generate a personalized workout plan using Gemini API
        
        Args:
            selected_types: List of workout types (cardio, plyometrics, strength, stretching)
            selected_muscles: List of target muscle groups
            difficulty: Difficulty level (beginner, intermediate, expert)
            prompt: User's fitness goals and preferences
            gender: Optional gender information
            age: Optional age in years
            weight: Optional weight in lbs/kg
            height: Optional height in inches/cm
            bench_press_pr: Optional bench press personal record
            squat_pr: Optional squat personal record
            deadlift_pr: Optional deadlift personal record
            pull_ups_pr: Optional pull-ups personal record
        
        Returns:
            WorkoutPlan: Generated workout plan
        """
        
        # Build the prompt for Gemini
        user_context = f"""
        Create a personalized 7-day workout plan with the following requirements:
        
        Workout Types: {', '.join(selected_types)}
        Target Muscle Groups: {', '.join(selected_muscles)}
        Difficulty Level: {difficulty}
        User Goals: {prompt}
        """
        
        if any([gender, age, weight, height]):
            user_context += "\n\nUser Profile:"
            if gender:
                user_context += f"\n- Gender: {gender}"
            if age:
                user_context += f"\n- Age: {age} years"
            if weight:
                user_context += f"\n- Weight: {weight}"
            if height:
                user_context += f"\n- Height: {height}"
        
        if any([bench_press_pr, squat_pr, deadlift_pr, pull_ups_pr]):
            user_context += "\n\nPersonal Records:"
            if bench_press_pr:
                user_context += f"\n- Bench Press: {bench_press_pr}"
            if squat_pr:
                user_context += f"\n- Squat: {squat_pr}"
            if deadlift_pr:
                user_context += f"\n- Deadlift: {deadlift_pr}"
            if pull_ups_pr:
                user_context += f"\n- Pull-ups: {pull_ups_pr}"
        
        user_context += """
        
        Requirements:
        - Create exactly 7 days (dayIndex 0-6 for Sunday-Saturday)
        - Include appropriate rest days
        - For strength exercises: include sets, reps, and rest periods
        - For cardio exercises: include duration or distance
        - Include warm-up and cool-down sections where appropriate
        - Exercise types must be: 'strength', 'cardio', or 'mobility'
        - Weight units: 'lbs' or 'kg'
        - Distance units: 'm', 'km', or 'mi'
        - Duration and rest periods in seconds
        - Provide specific exercise names and clear instructions
        """
        
        try:
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=user_context,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": WorkoutPlan,
                },
            )
            
            # Return the parsed workout plan
            return response.parsed
            
        except Exception as e:
            raise Exception(f"Failed to generate workout plan: {str(e)}")
    
    def generate_single_workout(
        self,
        workout_type: str,
        target_muscles: List[str],
        difficulty: str,
        duration_minutes: int = 45
    ) -> List[Exercise]:
        """
        Generate a single workout session
        
        Args:
            workout_type: Type of workout (strength, cardio, etc.)
            target_muscles: List of muscle groups to target
            difficulty: Difficulty level
            duration_minutes: Target duration in minutes
        
        Returns:
            List[Exercise]: List of exercises for the workout
        """
        
        prompt = f"""
        Create a single {workout_type} workout session targeting {', '.join(target_muscles)} 
        for {difficulty} level, approximately {duration_minutes} minutes long.
        
        Include appropriate exercises with sets, reps, weights, and rest periods.
        """
        
        try:
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": List[Exercise],
                },
            )
            
            return response.parsed
            
        except Exception as e:
            raise Exception(f"Failed to generate workout: {str(e)}")

# Example usage
if __name__ == "__main__":
    # Initialize the generator
    generator = WorkoutGenerator()
    
    # Example workout plan generation
    try:
        workout_plan = generator.generate_workout_plan(
            selected_types=["strength", "cardio"],
            selected_muscles=["chest", "back", "legs"],
            difficulty="intermediate",
            prompt="I want to build muscle and improve cardiovascular health. I can work out 4-5 times per week.",
            age=25,
            weight=150,
            gender="male"
        )
        
        print("Generated Workout Plan:")
        print(f"Name: {workout_plan.name}")
        print(f"Description: {workout_plan.description}")
        print(f"Number of days: {len(workout_plan.days)}")
        
        for day in workout_plan.days:
            print(f"\n{day.dayName} (Day {day.dayIndex}):")
            if day.isRestDay:
                print("  Rest Day")
            else:
                print(f"  Exercises: {len(day.exercises)}")
                for exercise in day.exercises[:3]:  # Show first 3 exercises
                    print(f"    - {exercise.name} ({exercise.type})")
        
    except Exception as e:
        print(f"Error: {e}") 