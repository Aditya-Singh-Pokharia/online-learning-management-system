const express = require('express');
const router = express.Router();
const { getCertificate, getMyCertificates } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyCertificates);
router.get('/:id', protect, getCertificate);

module.exports = router;
