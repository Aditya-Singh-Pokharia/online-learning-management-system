const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:courseId', protect, authorize('student'), getProgress);
router.post('/:courseId', protect, authorize('student'), updateProgress);

module.exports = router;
