const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = require("express").Router();
const WorkoutPlan = require('../schemas/workoutPlan.schema');
const { fetchExercisesFromNinjas } = require('../utils/ninjas.js');
const requireAuth = require('../middleware/requireAuth.js');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.use(requireAuth);

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
        const userID = req.user.id;
        const workoutPlans = await WorkoutPlan.find({ userID: userID }).sort({ createdAt: -1 });
        res.status(200).json(workoutPlans);
    } catch (error) {
        console.error('Error getting plans:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/create-plan", async (req, res) => {
    try {
        const { prompt, types, muscles, difficulty } = req.body;
        const userID = req.user.id;

        let exerciseList = [];

        // if types or muscles are not arrays, convert them to be one
        const typesArray = Array.isArray(types) ? types : [types];
        const musclesArray = Array.isArray(muscles) ? muscles : [muscles];

        for (const type of typesArray) {
          for (const muscle of musclesArray) {
            const result = await fetchExercisesFromNinjas({ type, difficulty, muscle });
            exerciseList.push(...result);
          }
        }

        // turn the exercise list into a nice JSON string
        const exerciseJSON = JSON.stringify(exerciseList, null, 2);
        
        const fullPrompt = `
        ${workoutPlanInstructions}
        
        User request: ${prompt}

        If the user request includes settings (i.e weight unit, gender, age, height, weight, bench press PR, squat PR, deadlift PR, pull ups PR), use the settings from the user's profile to generate the plan.
        
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
            userID: userID,
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
        const userID = req.user.id;

        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required" });
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (startDate) updateData.startDate = startDate;
        
        if (days && Array.isArray(days) && days.length === 7) {
            updateData.days = days;
        }
        
        const workoutPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userID: userID },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!workoutPlan) {
            return res.status(404).json({ error: "Workout plan not found or unauthorized" });
        }
        
        res.status(200).json(workoutPlan);
    } catch (error) {
        console.error('Error editing plan:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete("/delete-plan", async (req, res) => {
    try {
        const { planId } = req.body;
        const userID = req.user.id;

        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required" });
        }
        
        const workoutPlan = await WorkoutPlan.findOneAndDelete({ 
            _id: planId, 
            userID: userID
        });
        
        if (!workoutPlan) {
            return res.status(404).json({ error: "Workout plan not found or unauthorized" });
        }
        
        res.status(200).json({ message: "Workout plan deleted successfully", deletedPlan: workoutPlan });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post("/add-settings", async (req, res) => {
  try {

  } catch(error) {
    console.error('Error adding settings:', error);
    res.status(400).json({ error: error.message });
  }

})

router.post("/generate-plan", async (req, res) => {
    try {
        const { 
            selectedTypes, 
            selectedMuscles, 
            selectedDifficulty, 
            prompt,
            gender,
            age,
            weight,
            height,
            benchpressPR,
            squatPR,
            deadliftPR,
            pullUpsPR,
            weightUnit
        } = req.body;
        const userID = req.user.id;

        // Validate required fields
        if (!selectedTypes || selectedTypes.length === 0) {
            return res.status(400).json({ error: "Please select at least one workout type" });
        }
        if (!selectedMuscles || selectedMuscles.length === 0) {
            return res.status(400).json({ error: "Please select at least one muscle group" });
        }
        if (!selectedDifficulty) {
            return res.status(400).json({ error: "Please select a difficulty level" });
        }
        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({ error: "Please describe your fitness goals" });
        }

        // Build the user context for Gemini
        let userContext = `
        Create a personalized 7-day workout plan with the following requirements:
        
        Workout Types: ${selectedTypes.join(', ')}
        Target Muscle Groups: ${selectedMuscles.join(', ')}
        Difficulty Level: ${selectedDifficulty}
        User Goals: ${prompt}
        Preferred weight unit: ${weightUnit || 'lbs'}
        All weights in the plan should be in ${weightUnit || 'lbs'}.
        `;
        
        if (gender || age || weight || height) {
            userContext += "\n\nUser Profile:";
            if (gender) userContext += `\n- Gender: ${gender}`;
            if (age) userContext += `\n- Age: ${age} years`;
            if (weight) userContext += `\n- Weight: ${weight}`;
            if (height) userContext += `\n- Height: ${height}`;
        }
        
        if (benchpressPR || squatPR || deadliftPR || pullUpsPR) {
            userContext += "\n\nPersonal Records:";
            if (benchpressPR) userContext += `\n- Bench Press: ${benchpressPR}`;
            if (squatPR) userContext += `\n- Squat: ${squatPR}`;
            if (deadliftPR) userContext += `\n- Deadlift: ${deadliftPR}`;
            if (pullUpsPR) userContext += `\n- Pull-ups: ${pullUpsPR}`;
        }
        
        userContext += `
        
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
        
        ${workoutPlanInstructions}
        `;

        console.log(userContext)
        
        const result = await model.generateContent(userContext);
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
                name: "Custom Workout Plan",
                description: "Generated workout plan based on your preferences. The AI response couldn't be parsed properly.",
                days: []
            };
        }
        
        const newPlan = new WorkoutPlan({
            name: planData.name,
            userID: userID,
            description: planData.description,
            startDate: new Date(),
            days: planData.days,
            weightUnit: weightUnit || 'lbs',
        });
        
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/chat", async (req, res) => {
    try {
        const { message, planId } = req.body;
        const userID = req.user.id;

        if (!message || !planId) {
            return res.status(400).json({ error: "Message and plan ID are required" });
        }

        const workoutPlan = await WorkoutPlan.findOne({ _id: planId, userID: userID });
        if (!workoutPlan) {
            return res.status(404).json({ error: "Workout plan not found or unauthorized" });
        }

        // Create a simplified version of the plan with only essential information
        const simplifiedPlan = {
            name: workoutPlan.name,
            weightUnit: workoutPlan.weightUnit || 'lbs',
            days: workoutPlan.days.map(day => ({
                dayName: day.dayName,
                isRestDay: day.isRestDay,
                exercises: day.exercises.map(ex => ({
                    name: ex.name,
                    type: ex.type,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight
                }))
            }))
        };

        const planContext = `
        You are a fitness trainer assistant. User's workout plan:
        ${JSON.stringify(simplifiedPlan)}
        Question: ${message}
        Provide a brief answer (5-10 sentences) in plain text with no special formatting.`;

        const result = await model.generateContent(planContext);
        const response = result.response.text();

        res.status(200).json({ 
            message: response,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

