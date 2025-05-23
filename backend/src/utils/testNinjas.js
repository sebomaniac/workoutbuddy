require('dotenv').config();

const { fetchExercisesFromNinjas } = require('./ninjas.js');

(async () => {
    const exercises = await fetchExercisesFromNinjas({
        type: 'strength',
        muscle: 'chest',
        difficulty: 'intermediate'
    });

    console.log(exercises);
})();