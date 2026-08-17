const express = require('express');
const router = express.Router();
const { getEnrolledCourses } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/enrolled-courses', protect, authorize('student'), getEnrolledCourses);

module.exports = router;
