const router = require("express").Router();
const { fetchExercisesFromNinjas } = require('../utils/ninjas.js');

router.get("/", async (req, res) => {
  try {
    const exercises = await fetchExercisesFromNinjas(req.query);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 