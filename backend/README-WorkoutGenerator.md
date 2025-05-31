# Workout Generator Setup
#### 1. Activate the Virtual Environment
```bash
cd backend
source venv/bin/activate
```
#### 2. Set up your Gemini API Key
```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
```
Or create a `.env` file in the backend directory:
```bash
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```
#### 3. Verify Installation
```bash
python3 -c "from workout_generator import WorkoutGenerator; print('Setup successful!')"
```
