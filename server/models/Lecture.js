const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    video: {
      url: { type: String, required: true }, // Cloudinary secure_url
      publicId: { type: String, required: true },
      duration: { type: Number, default: 0 }, // seconds, from Cloudinary metadata
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lecture', lectureSchema);
