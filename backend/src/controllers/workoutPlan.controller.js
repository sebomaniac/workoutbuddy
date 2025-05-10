const router = require("express").Router();
const WorkoutPlan = require('../schemas/workoutPlan.schema');

router.get("/all-plans", async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find()
        res.status(200).json(workoutPlans);
    } catch (error) {
        console.error('Error getting plans:', error);
        res.status(500).json({ error: error.message });
    }
})

router.post("/create-plan", async (req, res) => {
    try {
        const newPlan = new WorkoutPlan(req.body);
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;

