# cs35l-project

## Table of Contents
- [Project Members](#project-members)
- [Project Description](#project-description)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)

## Project Members
Daniel Zhou, Kian Shandi, Lavender Hwang, Mark Mairs, Sebastian Mendez Johannessen

## Project Description
Workout Buddy is a full-stack web application that provides users with custom workout plans based on their current fitness level, goals, and time commitment. By leveraging an AI-powered backend assistant, Workout Buddy generates tailored weekly workout plans to help users train smarter and stay motivated.

## Technology Stack
#### Frontend
- React.js
- React Router
- Tailwind CSS
#### Backend
- Node.js
- Express
- Google Gemini API
- Ninjas Exercises API
#### Database
- MongoDB
- Mongoose
#### Authentication
- Firebase Auth
#### Deployment
- Vercel

## Setup Instructions

1. Clone this GitHub repository
```
git clone https://github.com/sebomaniac/cs35l-project.git
```

2. In a Visual Studio Code terminal, change directory to the backend folder
```
cd cs35l-project/backend
```

3. Install backend dependencies
```
npm install
```

4. Create a .env file in the backend directory with your API keys and MongoDB URI
```
// cs35l-project/backend/.env
GEMINI_API_KEY=your_gemini_key_here
NINJAS_API_KEY=your_ninjas_key_here
MONGODB_URI=your_mongodb_uri_here
```

5. Run the backend
```
node src/server.js
```

6. In a new terminal window, change directory to the frontend folder
```
cd cs35l-project/frontend
```

7. Install frontend dependencies
```
npm install
```

8. Run the frontend
```
npm run dev
```

9. Open the app in your browser
```
Cmd-Click --> http://localhost:5173/
```