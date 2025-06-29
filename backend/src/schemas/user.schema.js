const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  workoutPlan: {
    type: Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  }
});

module.exports = mongoose.model("User", userSchema);
