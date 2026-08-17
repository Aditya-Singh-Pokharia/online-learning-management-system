const asyncHandler = require('../utils/asyncHandler');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');
const { recalculateProgress } = require('../services/progressService');

// @desc    Get a student's progress for one course
// @route   GET /api/progress/:courseId
// @access  Private/Student
const getProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({
    student: req.user._id,
    course: req.params.courseId,
  }).populate('completedLectures', 'title').populate('lastWatchedLecture', 'title');

  if (!progress) {
    res.status(404);
    throw new Error('No progress found. Are you enrolled in this course?');
  }

  res.json({ success: true, data: progress });
});

// @desc    Mark a lecture as completed / update last-watched position
// @route   POST /api/progress/:courseId
// @access  Private/Student
// body: { lectureId, completed: true }
const updateProgress = asyncHandler(async (req, res) => {
  const { lectureId, completed } = req.body;
  const { courseId } = req.params;

  const enrolled = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrolled) {
    res.status(403);
    throw new Error('You must be enrolled in this course');
  }

  const lecture = await Lecture.findById(lectureId);
  if (!lecture || lecture.course.toString() !== courseId) {
    res.status(404);
    throw new Error('Lecture not found in this course');
  }

  let progress = await Progress.findOne({ student: req.user._id, course: courseId });
  if (!progress) {
    progress = await Progress.create({ student: req.user._id, course: courseId });
  }

  progress.lastWatchedLecture = lecture._id;

  if (completed) {
    const already = progress.completedLectures.some((id) => id.toString() === lecture._id.toString());
    if (!already) progress.completedLectures.push(lecture._id);
  }

  await progress.save();
  const updated = await recalculateProgress(req.user._id, courseId);

  res.json({ success: true, data: updated });
});

module.exports = { getProgress, updateProgress };
