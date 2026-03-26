const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
    enum: [9, 10],
  },
  subject: {
    type: String,
    required: true,
    default: 'physics',
    lowercase: true,
  },
  chapter: {
    number: { type: Number, required: true },
    name: {
      bangla: { type: String, required: true },
      english: { type: String, required: true },
    },
  },
  topic: {
    bangla: { type: String, required: true },
    english: { type: String, required: true },
  },
  // Main bilingual content
  content: {
    bangla: { type: String, required: true },
    english: { type: String, required: true },
  },
  // Formulas as an array of formula objects
  formulas: [
    {
      name: {
        bangla: String,
        english: String,
      },
      formula: String,       // The actual formula expression e.g. "v = u + at"
      explanation: {
        bangla: String,
        english: String,
      },
    },
  ],
  // Examples as an array
  examples: [
    {
      question: {
        bangla: String,
        english: String,
      },
      solution: {
        bangla: String,
        english: String,
      },
    },
  ],
  order: {
    type: Number,
    default: 0, // for ordering topics within a chapter
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast lookups by chapter
topicSchema.index({ 'chapter.number': 1, class: 1 });

module.exports = mongoose.model('Topic', topicSchema);
