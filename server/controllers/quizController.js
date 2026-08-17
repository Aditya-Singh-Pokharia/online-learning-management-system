const asyncHandler = require('../utils/asyncHandler');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Module = require('../models/Module');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');
const { recalculateProgress } = require('../services/progressService');

// @desc    Create a quiz (with questions) for a module
// @route   POST /api/quizzes
// @access  Private/Instructor (owner only)
// body: { title, moduleId, passingScorePercent, questions: [{questionText, options, correctAnswerIndex}] }
const createQuiz = asyncHandler(async (req, res) => {
  const { title, moduleId, passingScorePercent, questions } = req.body;

  if (!title || !moduleId || !Array.isArray(questions) || questions.length === 0) {
    res.status(400);
    throw new Error('Title, moduleId and at least one question are required');
  }

  const module = await Module.findById(moduleId);
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }
  const course = await Course.findById(module.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to add a quiz to this course');
  }
  if (module.quiz) {
    res.status(400);
    throw new Error('This module already has a quiz');
  }

  const createdQuestions = await Question.insertMany(
    questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
    }))
  );

  const quiz = await Quiz.create({
    title,
    course: course._id,
    module: module._id,
    passingScorePercent: passingScorePercent || 60,
    questions: createdQuestions.map((q) => q._id),
  });

  module.quiz = quiz._id;
  await module.save();

  res.status(201).json({ success: true, data: quiz });
});

// @desc    Get a quiz (for taking it) - correct answers stripped for students
// @route   GET /api/quizzes/:id
// @access  Private (enrolled students or the owning instructor)
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  const course = await Course.findById(quiz.course);
  const isOwner = course.instructor.toString() === req.user._id.toString();

  if (!isOwner) {
    const enrolled = await Enrollment.findOne({ student: req.user._id, course: quiz.course });
    if (!enrolled) {
      res.status(403);
      throw new Error('You must be enrolled in this course to view the quiz');
    }
  }

  const payload = quiz.toObject();
  if (!isOwner) {
    payload.questions = payload.questions.map(({ correctAnswerIndex, ...rest }) => rest);
  }

  res.json({ success: true, data: payload });
});

// @desc    Submit answers, get scored, tracked as an attempt, updates progress
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student (enrolled)
// body: { answers: [optionIndex, ...] }  (same order as quiz.questions)
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers)) {
    res.status(400);
    throw new Error('answers must be an array of selected option indices');
  }

  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  const enrolled = await Enrollment.findOne({ student: req.user._id, course: quiz.course });
  if (!enrolled) {
    res.status(403);
    throw new Error('You must be enrolled in this course to submit this quiz');
  }

  let correctCount = 0;
  quiz.questions.forEach((q, idx) => {
    if (answers[idx] === q.correctAnswerIndex) correctCount += 1;
  });
  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = scorePercent >= quiz.passingScorePercent;

  const attempt = await QuizAttempt.create({
    student: req.user._id,
    quiz: quiz._id,
    course: quiz.course,
    answers,
    scorePercent,
    passed,
  });

  // Update / create the Progress document's quizResults entry
  let progress = await Progress.findOne({ student: req.user._id, course: quiz.course });
  if (!progress) {
    progress = await Progress.create({ student: req.user._id, course: quiz.course });
  }
  const existingResult = progress.quizResults.find((r) => r.quiz.toString() === quiz._id.toString());
  if (existingResult) {
    existingResult.bestScorePercent = Math.max(existingResult.bestScorePercent, scorePercent);
    existingResult.passed = existingResult.passed || passed;
  } else {
    progress.quizResults.push({ quiz: quiz._id, bestScorePercent: scorePercent, passed });
  }
  await progress.save();
  await recalculateProgress(req.user._id, quiz.course);

  res.json({
    success: true,
    data: {
      scorePercent,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      attemptId: attempt._id,
    },
  });
});

module.exports = { createQuiz, getQuiz, submitQuiz };
