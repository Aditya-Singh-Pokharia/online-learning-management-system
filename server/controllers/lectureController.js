const asyncHandler = require('../utils/asyncHandler');
const Lecture = require('../models/Lecture');
const Module = require('../models/Module');
const Course = require('../models/Course');
const { deleteAsset } = require('../services/cloudinaryService');

const assertOwnsCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const err = new Error('Course not found');
    err.status = 404;
    throw err;
  }
  if (course.instructor.toString() !== userId.toString()) {
    const err = new Error('Not authorized to modify this course');
    err.status = 403;
    throw err;
  }
  return course;
};

// @desc    Upload a video lecture into a module
// @route   POST /api/lectures
// @access  Private/Instructor (owner only)
// body: { title, description, moduleId, order }  file: "video"
const createLecture = asyncHandler(async (req, res) => {
  const { title, description, moduleId, order } = req.body;

  if (!title || !moduleId) {
    res.status(400);
    throw new Error('Title and moduleId are required');
  }
  if (!req.file) {
    res.status(400);
    throw new Error('A video file is required');
  }

  const module = await Module.findById(moduleId);
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  const course = await Course.findById(module.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to add lectures to this course');
  }

  const lecture = await Lecture.create({
    title,
    description,
    module: module._id,
    course: course._id,
    order: order || 0,
    video: {
      url: req.file.path,
      publicId: req.file.filename,
      duration: req.file.duration || 0,
    },
  });

  module.lectures.push(lecture._id);
  await module.save();

  res.status(201).json({ success: true, data: lecture });
});

// @desc    Update lecture metadata, optionally replace the video file
// @route   PUT /api/lectures/:id
// @access  Private/Instructor (owner only)
const updateLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    res.status(404);
    throw new Error('Lecture not found');
  }
  await assertOwnsCourse(lecture.course, req.user._id);

  const { title, description, order } = req.body;
  if (title) lecture.title = title;
  if (description !== undefined) lecture.description = description;
  if (order !== undefined) lecture.order = order;

  if (req.file) {
    await deleteAsset(lecture.video.publicId, 'video');
    lecture.video = { url: req.file.path, publicId: req.file.filename, duration: req.file.duration || 0 };
  }

  await lecture.save();
  res.json({ success: true, data: lecture });
});

// @desc    Delete a lecture (and its Cloudinary video)
// @route   DELETE /api/lectures/:id
// @access  Private/Instructor (owner only)
const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    res.status(404);
    throw new Error('Lecture not found');
  }
  await assertOwnsCourse(lecture.course, req.user._id);

  await deleteAsset(lecture.video.publicId, 'video');
  await Module.findByIdAndUpdate(lecture.module, { $pull: { lectures: lecture._id } });
  await lecture.deleteOne();

  res.json({ success: true, message: 'Lecture deleted successfully' });
});

module.exports = { createLecture, updateLecture, deleteLecture };
