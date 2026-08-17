import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

import Home from './pages/public/Home';
import Courses from './pages/public/Courses';
import CourseDetails from './pages/public/CourseDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CourseLearning from './pages/student/CourseLearning';
import QuizPage from './pages/student/QuizPage';
import ProgressPage from './pages/student/ProgressPage';
import Certificates from './pages/student/Certificates';
import CertificateView from './pages/student/CertificateView';
import Profile from './pages/student/Profile';

import InstructorDashboard from './pages/instructor/InstructorDashboard';
import ManageCourses from './pages/instructor/ManageCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import ViewStudents from './pages/instructor/ViewStudents';
import InstructorProfile from './pages/instructor/InstructorProfile';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/certificate/:id" element={<CertificateView />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/my-courses" element={<ProtectedRoute role="student"><MyCourses /></ProtectedRoute>} />
          <Route path="/student/learn/:courseId" element={<ProtectedRoute role="student"><CourseLearning /></ProtectedRoute>} />
          <Route path="/student/quiz/:quizId/:courseId" element={<ProtectedRoute role="student"><QuizPage /></ProtectedRoute>} />
          <Route path="/student/progress" element={<ProtectedRoute role="student"><ProgressPage /></ProtectedRoute>} />
          <Route path="/student/certificates" element={<ProtectedRoute role="student"><Certificates /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

          {/* Instructor */}
          <Route path="/instructor/dashboard" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><ManageCourses /></ProtectedRoute>} />
          <Route path="/instructor/courses/new" element={<ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/edit" element={<ProtectedRoute role="instructor"><EditCourse /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/students" element={<ProtectedRoute role="instructor"><ViewStudents /></ProtectedRoute>} />
          <Route path="/instructor/profile" element={<ProtectedRoute role="instructor"><InstructorProfile /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
