const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');
const { deleteAsset } = require('../services/cloudinaryService');

// @desc    List/browse courses (with search, category, difficulty filters)
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { search, category, difficulty, instructor } = req.query;
  const filter = { published: true };

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (instructor) filter.instructor = instructor;

  const courses = await Course.find(filter)
    .populate('instructor', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: courses.length, data: courses });
});

// @desc    Get single course with full module/lecture/quiz structure
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar bio')
    .populate({
      path: 'modules',
      options: { sort: { order: 1 } },
      populate: [
        { path: 'lectures', options: { sort: { order: 1 } } },
        { path: 'quiz', populate: { path: 'questions' } },
      ],
    });

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json({ success: true, data: course });
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, difficulty, price } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Title, description and category are required');
  }

  const course = await Course.create({
    title,
    description,
    category,
    difficulty,
    price,
    instructor: req.user._id,
    thumbnail: req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : undefined,
  });

  res.status(201).json({ success: true, data: course });
});

// @desc    Update a course (title/description/category/thumbnail/etc.)
// @route   PUT /api/courses/:id
// @access  Private/Instructor (owner only)
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this course');
  }

  const fields = ['title', 'description', 'category', 'difficulty', 'price', 'published'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) course[f] = req.body[f];
  });

  if (req.file) {
    await deleteAsset(course.thumbnail?.publicId, 'image');
    course.thumbnail = { url: req.file.path, publicId: req.file.filename };
  }

  await course.save();
  res.json({ success: true, data: course });
});

// @desc    Delete a course and all its modules/lectures/quizzes/questions
// @route   DELETE /api/courses/:id
// @access  Private/Instructor (owner only)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  const modules = await Module.find({ course: course._id });
  for (const mod of modules) {
    const lectures = await Lecture.find({ module: mod._id });
    for (const lec of lectures) {
      await deleteAsset(lec.video.publicId, 'video');
      await lec.deleteOne();
    }
    if (mod.quiz) {
      const quiz = await Quiz.findById(mod.quiz);
      if (quiz) {
        await Question.deleteMany({ _id: { $in: quiz.questions } });
        await quiz.deleteOne();
      }
    }
    await mod.deleteOne();
  }

  await deleteAsset(course.thumbnail?.publicId, 'image');
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ success: true, message: 'Course deleted successfully' });
});

// @desc    Create a module (section) within a course
// @route   POST /api/courses/:id/modules
// @access  Private/Instructor (owner only)
const addModule = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { title, order } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Module title is required');
  }

  const module = await Module.create({ title, order: order || 0, course: course._id });
  course.modules.push(module._id);
  await course.save();

  res.status(201).json({ success: true, data: module });
});

// @desc    Instructor: list students enrolled in one of their courses + progress
// @route   GET /api/courses/:id/students
// @access  Private/Instructor (owner only)
const getEnrolledStudents = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const Progress = require('../models/Progress');
  const enrollments = await Enrollment.find({ course: course._id }).populate(
    'student',
    'name email avatar'
  );

  const data = await Promise.all(
    enrollments.map(async (enr) => {
      const progress = await Progress.findOne({ student: enr.student._id, course: course._id });
      return {
        student: enr.student,
        enrolledAt: enr.enrolledAt,
        completionPercent: progress?.completionPercent || 0,
        completed: progress?.completed || false,
      };
    })
  );

  res.json({ success: true, count: data.length, data });
});

// @desc    Instructor: list courses they created
// @route   GET /api/courses/instructor/mine
// @access  Private/Instructor
const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: courses.length, data: courses });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  getEnrolledStudents,
  getMyCourses,
};
