const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = require("express").Router();
const WorkoutPlan = require('../schemas/workoutPlan.schema');
const { fetchExercisesFromNinjas } = require('../utils/ninjas.js');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Define workout plan generation instructions
const workoutPlanInstructions = `
You are a professional fitness trainer specializing in creating personalized workout plans. 
Generate a detailed 7-day workout plan with the following structure in JSON format:

{
  "name": "Plan name",
  "description": "Detailed plan description",
  "days": [
    {
      "dayIndex": 0,
      "dayName": "Monday",
      "isRestDay": false,
      "warmUp": {
        "exercises": [
          {
            "name": "Light Jogging",
            "type": "cardio", // ONLY use: "strength", "cardio", or "mobility"
            "duration": 5,
            "notes": "Keep pace moderate"
          }
        ],
        "totalDuration": 10
      },
      "exercises": [
        {
          "name": "Bench Press",
          "type": "strength", // ONLY use: "strength", "cardio", or "mobility"
          "sets": 4,
          "reps": 10, // MUST be a number - for "as many as possible" use 999
          "weight": 135,
          "weightUnit": "lbs", // ONLY use: "lbs" or "kg"
          "restBetweenSets": 90,
          "notes": "Focus on form"
        }
      ],
      "coolDown": {
        "exercises": [
          {
            "name": "Stretching",
            "type": "mobility", // ONLY use: "strength", "cardio", or "mobility"
            "duration": 5,
            "notes": "Hold each stretch for 30 seconds"
          }
        ],
        "totalDuration": 5
      },
      "notes": "Day-specific notes"
    }
  ]
}

Make sure to include all 7 days (dayIndex 0-6) with appropriate dayNames.
For rest days, set isRestDay to true and include minimal warm-up and cool-down exercises.
Be specific with exercise names, sets, reps, and include appropriate notes for form.
`;

router.get("/all-plans", async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find();
        res.status(200).json(workoutPlans);
    } catch (error) {
        console.error('Error getting plans:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/create-plan", async (req, res) => {
    try {
        const { prompt, type, muscles, difficulty } = req.body;

        let exerciseList = [];

        if (Array.isArray(muscles)) {
          for (const muscle of muscles) {
            const result = await fetchExercisesFromNinjas({ type, difficulty, muscle });
            exerciseList.push(...result);
          }
        } else {
            const result = await fetchExercisesFromNinjas({ type, difficulty, muscle: muscles });
            exerciseList = result;
        }

        // turn the exercise list into a nice JSON string
        const exerciseJSON = JSON.stringify(exerciseList, null, 2);
        
        const fullPrompt = `
        ${workoutPlanInstructions}
        
        User request: ${prompt}
        
        Available exercises you can use: ${exerciseJSON}
        
        Respond with only the JSON, no additional text or markdown formatting.
        `;
        
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();
        const cleanedResponse = responseText.replace(/```(json)?|```/g, '').trim();
    
        let planData;
        try {
            planData = JSON.parse(cleanedResponse);
            console.log("Successfully parsed JSON response");
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            console.log('Raw response:', responseText);
            
            // Create default plan data
            planData = {
                name: req.body.name || "Custom Workout Plan",
                description: "Generated workout plan based on your request. The AI response couldn't be parsed properly.",
                days: []
            };
        }
        
        const newPlan = new WorkoutPlan({
            name: planData.name,
            description: planData.description,
            startDate: req.body.startDate || new Date(),
            days: planData.days
        });
        
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post("/edit-plan", async (req, res) => {
    try {
        const { planId, name, description, startDate, days } = req.body;
        
        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required" });
        }
        
        const existingPlan = await WorkoutPlan.findById(planId);
        if (!existingPlan) {
            return res.status(404).json({ error: "Workout plan not found" });
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (startDate) updateData.startDate = startDate;
        
        if (days && Array.isArray(days) && days.length === 7) {
            updateData.days = days;
        }
        
        const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
            planId,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.status(200).json(workoutPlan);
    } catch (error) {
        console.error('Error editing plan:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete("/delete-plan", async (req, res) => {
    try {
        const { planId } = req.body;
        
        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required" });
        }
        
        const existingPlan = await WorkoutPlan.findById(planId);
        if (!existingPlan) {
            return res.status(404).json({ error: "Workout plan not found" });
        }
        
        const workoutPlan = await WorkoutPlan.findByIdAndDelete(planId);
        res.status(200).json({ message: "Workout plan deleted successfully", deletedPlan: workoutPlan });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

