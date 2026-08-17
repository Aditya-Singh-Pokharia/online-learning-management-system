const Progress = require('../models/Progress');
const Module = require('../models/Module');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const generateCertificateId = require('../utils/certificateId');

const recalculateProgress = async (studentId, courseId) => {
  const progress = await Progress.findOne({ student: studentId, course: courseId });
  if (!progress) return null;

  const modules = await Module.find({ course: courseId }).populate('lectures quiz');

  let totalItems = 0;
  let completedItems = 0;

  for (const mod of modules) {
    totalItems += mod.lectures.length;
    completedItems += mod.lectures.filter((lec) =>
      progress.completedLectures.some((id) => id.toString() === lec._id.toString())
    ).length;

    if (mod.quiz) {
      totalItems += 1;
      const result = progress.quizResults.find(
        (r) => r.quiz.toString() === mod.quiz._id.toString()
      );
      if (result && result.passed) completedItems += 1;
    }
  }

  const completionPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  progress.completionPercent = completionPercent;

  const justCompleted = completionPercent === 100 && !progress.completed;
  if (completionPercent === 100) {
    progress.completed = true;
    progress.completedAt = progress.completedAt || new Date();
  }

  await progress.save();

  // Issue a certificate the first time a course hits 100%.
  if (justCompleted) {
    const existing = await Certificate.findOne({ student: studentId, course: courseId });
    if (!existing) {
      const course = await Course.findById(courseId).populate('instructor', 'name');
      const student = await require('../models/User').findById(studentId);
      await Certificate.create({
        certificateId: generateCertificateId(),
        student: studentId,
        course: courseId,
        studentName: student.name,
        courseName: course.title,
        instructorName: course.instructor.name,
        completionDate: new Date(),
      });
    }
  }

  return progress;
};

module.exports = { recalculateProgress };
