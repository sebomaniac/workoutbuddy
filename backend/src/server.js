require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const workoutPlanRoutes = require('./controllers/workoutPlan.controller');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", workoutPlanRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
  });
  res.status(500).json({ 
      error: 'Something went wrong!',
      details: err.message
  });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB successfully");
})
.catch(err => {
  console.error("MongoDB connection error:", {
      error: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name
  });
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});