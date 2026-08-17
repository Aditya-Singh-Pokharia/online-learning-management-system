const asyncHandler = require('../utils/asyncHandler');
const Certificate = require('../models/Certificate');

// @desc    Get a single certificate by its Mongo _id or its certificateId
// @route   GET /api/certificates/:id
// @access  Private (student who owns it, or anyone with the certificateId for verification)
const getCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findOne({
    $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { certificateId: id }],
  });

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  res.json({ success: true, data: certificate });
});

// @desc    List all certificates earned by the logged-in student
// @route   GET /api/certificates
// @access  Private/Student
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: certificates.length, data: certificates });
});

module.exports = { getCertificate, getMyCertificates };
