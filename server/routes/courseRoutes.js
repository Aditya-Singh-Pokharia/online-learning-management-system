const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  getEnrolledStudents,
  getMyCourses,
} = require('../controllers/courseController');
const { enrollInCourse } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');
const { uploadThumbnail } = require('../middleware/upload');

// Public
router.get('/', getCourses);

// Instructor-specific (must be before /:id so "instructor" isn't parsed as an id)
router.get('/instructor/mine', protect, authorize('instructor'), getMyCourses);

router.get('/:id', getCourseById);

router.post('/', protect, authorize('instructor'), uploadThumbnail.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('instructor'), uploadThumbnail.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

router.post('/:id/modules', protect, authorize('instructor'), addModule);
router.get('/:id/students', protect, authorize('instructor'), getEnrolledStudents);

router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);

module.exports = router;
