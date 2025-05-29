const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    weightUnit: {
      type: String,
      enum: ['lbs', 'kg'],
      default: 'lbs'
    },
    height: {
      type: Number,
      required: true
    },
    heightUnit: {
      type: String,
      enum: ['in', 'cm'],
      default: 'in'
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'other']
    },
    bmi: {
      type: Number
    },
    primaryGoal: {
      type: String,
      enum: [
        'weight loss',
        'muscle gain',
        'endurance',
        'flexibility',
        'general health'
      ],
      default: 'general health'
    },
    healthConditions: {
      type: [
        {
          name: { type: String, required: true },
          severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe']
          },
          notes: String,
          diagnosedOn: Date
        }
      ],
      default: []
    }
  })