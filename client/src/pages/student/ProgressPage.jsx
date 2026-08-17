import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import ProgressBar from '../../components/ProgressBar';
import EmptyState from '../../components/EmptyState';
import {
  LayoutDashboard, BookOpen, TrendingUp, Award, UserCircle,
  BarChart3, ImageOff, CheckCircle2,
} from 'lucide-react';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/student/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/student/progress', label: 'Progress', icon: TrendingUp },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

export default function ProgressPage() {
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/enrolled-courses').then((res) => setEnrolled(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Student" links={links} />
      <div className="flex-1 p-5 sm:p-8 max-w-4xl">
        <h1 className="text-2xl font-display font-bold mb-1">Progress Overview</h1>
        <p className="text-slate-500 mb-7">Track how far along you are in every course</p>
        {loading ? (
          <Spinner />
        ) : enrolled.length === 0 ? (
          <EmptyState icon={BarChart3} title="No progress to show yet" description="Enroll in a course to start tracking your progress." />
        ) : (
          <div className="space-y-4">
            {enrolled.map((e) => (
              <Link key={e.course._id} to={`/student/learn/${e.course._id}`} className="card-hover p-5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                  {e.course.thumbnail?.url ? <img src={e.course.thumbnail.url} className="w-full h-full object-cover" alt="" /> : <ImageOff size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-ink truncate">{e.course.title}</p>
                    {e.completed && <span className="badge-success shrink-0"><CheckCircle2 size={13} /> Completed</span>}
                  </div>
                  <ProgressBar percent={e.completionPercent} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
