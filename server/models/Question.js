const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    type: [String],
    validate: {
      validator: (arr) => arr.length >= 2,
      message: 'A question needs at least 2 options',
    },
    required: true,
  },
  correctAnswerIndex: { type: Number, required: true }, // index into options[]
});

module.exports = mongoose.model('Question', questionSchema);
