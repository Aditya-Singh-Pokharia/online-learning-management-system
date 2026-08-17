import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import CourseCard from '../../components/CourseCard';
import { LayoutDashboard, BookOpen, TrendingUp, Award, UserCircle, BookX } from 'lucide-react';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/student/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/student/progress', label: 'Progress', icon: TrendingUp },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

export default function MyCourses() {
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/enrolled-courses').then((res) => setEnrolled(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Student" links={links} />
      <div className="flex-1 p-5 sm:p-8">
        <h1 className="text-2xl font-display font-bold mb-1">My Courses</h1>
        <p className="text-slate-500 mb-7">{enrolled.length} course{enrolled.length === 1 ? '' : 's'} enrolled</p>
        {loading ? (
          <Spinner />
        ) : enrolled.length === 0 ? (
          <EmptyState
            icon={BookX}
            title="No enrolled courses"
            description="Enroll in a course to see it here."
            action={<Link to="/courses" className="btn-primary">Browse courses</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolled.map((e) => (
              <CourseCard
                key={e.course._id}
                course={e.course}
                to={`/student/learn/${e.course._id}`}
                progress={e.completionPercent}
                completed={e.completed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
