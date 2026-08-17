const mongoose = require('mongoose');

// A Module groups a set of Lectures (and optionally a Quiz) under a
// course, giving courses a "sections" structure, e.g. "Week 1: Basics".
const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Module', moduleSchema);
