// Populates the database with one instructor, one student, and a sample
// published course (module + 1 quiz) so the app is usable immediately.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const run = async () => {
  await connectDB();

  await User.deleteMany({ email: { $in: ['instructor@example.com', 'student@example.com'] } });

  const instructor = await User.create({
    name: 'Alex Rivera',
    email: 'instructor@example.com',
    password: 'password123',
    role: 'instructor',
    bio: 'Full-stack engineer and educator.',
  });

  await User.create({
    name: 'Jordan Lee',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
  });

  const course = await Course.create({
    title: 'Modern Web Development with the MERN Stack',
    description:
      'Learn to build full-stack apps with MongoDB, Express, React and Node.js: REST APIs, auth, and deployment.',
    instructor: instructor._id,
    category: 'Web Development',
    difficulty: 'Intermediate',
    price: 0,
    published: true,
  });

  const module1 = await Module.create({ title: 'Getting Started', order: 0, course: course._id });

  const quiz = await Quiz.create({
    title: 'Module 1 Check-in',
    course: course._id,
    module: module1._id,
    passingScorePercent: 70,
  });

  const questions = await Question.insertMany([
    {
      questionText: 'Which database does the MERN stack use?',
      options: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite'],
      correctAnswerIndex: 1,
    },
    {
      questionText: 'Which library builds the frontend UI?',
      options: ['Angular', 'Vue', 'React', 'Svelte'],
      correctAnswerIndex: 2,
    },
  ]);

  quiz.questions = questions.map((q) => q._id);
  await quiz.save();

  module1.quiz = quiz._id;
  await module1.save();

  course.modules.push(module1._id);
  await course.save();

  console.log('Seed complete.');
  console.log('NOTE: this seeded course has no lecture videos (upload one via');
  console.log('the instructor dashboard - it needs real Cloudinary credentials).');
  console.log('Instructor login: instructor@example.com / password123');
  console.log('Student login:    student@example.com / password123');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
