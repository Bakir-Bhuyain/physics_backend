const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  status: {
    type: String,
    enum: ['unstarted', 'reading', 'completed', 'mastered'],
    default: 'unstarted'
  },
  xpAwarded: {
    type: Boolean,
    default: false
  },
  lastVisited: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Ensure one progress record per user per topic
progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
