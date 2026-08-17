const express = require('express');
const router = express.Router();
const { createLecture, updateLecture, deleteLecture } = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/auth');
const { uploadVideo } = require('../middleware/upload');

router.post('/', protect, authorize('instructor'), uploadVideo.single('video'), createLecture);
router.put('/:id', protect, authorize('instructor'), uploadVideo.single('video'), updateLecture);
router.delete('/:id', protect, authorize('instructor'), deleteLecture);

module.exports = router;
