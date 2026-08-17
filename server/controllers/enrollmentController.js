const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// @desc    Enroll the logged-in student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (existing) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  await Enrollment.create({ student: req.user._id, course: course._id });
  await Progress.create({ student: req.user._id, course: course._id });

  course.studentsEnrolled += 1;
  await course.save();

  res.status(201).json({ success: true, message: 'Enrolled successfully' });
});

// @desc    Get the logged-in student's enrolled courses (with progress)
// @route   GET /api/users/enrolled-courses
// @access  Private/Student
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate({
    path: 'course',
    populate: { path: 'instructor', select: 'name' },
  });

  const data = await Promise.all(
    enrollments.map(async (enr) => {
      const progress = await Progress.findOne({ student: req.user._id, course: enr.course._id });
      return {
        course: enr.course,
        enrolledAt: enr.enrolledAt,
        completionPercent: progress?.completionPercent || 0,
        completed: progress?.completed || false,
      };
    })
  );

  res.json({ success: true, count: data.length, data });
});

module.exports = { enrollInCourse, getEnrolledCourses };
