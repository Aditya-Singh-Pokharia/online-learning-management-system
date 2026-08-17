const express = require('express');
const router = express.Router();
const { createQuiz, getQuiz, submitQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor'), createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;
