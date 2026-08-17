const mongoose = require('mongoose');

// One Progress document per (student, course) pair. Tracks which
// lectures are completed and the best quiz score per quiz, and
// derives an overall completion percentage.
const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    quizResults: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        bestScorePercent: { type: Number, default: 0 },
        passed: { type: Boolean, default: false },
      },
    ],
    lastWatchedLecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
    completionPercent: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
