async function fetchExercisesFromNinjas(params) {
    const { type, muscle, difficulty } = params;

    // automatically format the query string
    const query = new URLSearchParams({ type, muscle, difficulty }).toString();
    const url = `https://api.api-ninjas.com/v1/exercises?${query}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': process.env.NINJAS_API_KEY
            }
        });

        if (!response.ok) {
            const errorText = await response.text();  // give more context
            throw new Error(`Ninjas API error ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error("Failed to fetch exercises:", err.message);
        return [];
    }
}

module.exports = { fetchExercisesFromNinjas };