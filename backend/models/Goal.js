// backend/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
   status: { // You can add a status field
      type: String,
      enum: ['in-progress', 'completed', 'paused'],
      default: 'in-progress',
    }
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;