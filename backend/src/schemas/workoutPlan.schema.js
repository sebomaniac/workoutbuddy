const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  exerciseId:    { type: Schema.Types.ObjectId, ref: 'Exercise' },
  name:          { type: String, required: true },
  type:          { type: String, enum: ['strength','cardio','mobility'], required: true },
  sets:          Number,
  reps:          Number,
  weight:        Number,
  weightUnit:    { type: String, enum: ['lbs','kg'] },
  duration:      Number,         
  distance:      Number,         
  distanceUnit:  { type: String, enum: ['m','km','mi'] },
  restBetweenSets: Number,
  notes:         String
}, { _id: false });

const timedSectionSchema = new Schema({
  exercises:    { type: [exerciseSchema], default: [] },
  totalDuration:{ type: Number }    
}, { _id: false });

const daySchema = new Schema({
  dayIndex:   { type: Number, min: 0, max: 6, required: true },
  dayName:    { type: String, required: true },
  isRestDay:  { type: Boolean, default: false },
  warmUp:     timedSectionSchema,
  exercises:  { type: [exerciseSchema], default: [] },
  coolDown:   timedSectionSchema,
  notes:      String
}, { _id: false });

function sevenDays(val) {
  return Array.isArray(val) && val.length === 7;
}

const workoutPlanSchema = new Schema({
  name:        { type: String, required: true },
  description: String,
  createdBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate:   Date,
  days: {
    type: [daySchema],
    validate: {
      validator: sevenDays,
      message: props => `A plan must have exactly 7 days (got ${props.value.length})`
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);