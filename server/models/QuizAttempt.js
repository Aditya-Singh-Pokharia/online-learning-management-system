const mongoose = require('mongoose');

// Records every time a student submits a quiz, so attempts can be
// tracked historically instead of overwriting the previous result.
const quizAttemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    answers: [{ type: Number }], // selected option index per question, in order
    scorePercent: { type: Number, required: true },
    passed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
