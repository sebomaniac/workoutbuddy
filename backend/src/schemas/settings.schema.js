const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    settings: {
      weight: {
        type: Number
      },
      height: {
        type: Number
      },
      age: {
        type: Number
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
      },
      benchpressPR: {
        type: Number
      },
      squatPR: {
        type: Number
      },
      deadliftPR: {
        type: Number
      },
      pullUpsPR: {
        type: Number
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', settingsSchema);