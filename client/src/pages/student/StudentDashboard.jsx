import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import ProgressBar from '../../components/ProgressBar';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, TrendingUp, Award, UserCircle,
  ImageOff, BookX, ArrowRight, PlayCircle, CheckCircle2, Flame,
} from 'lucide-react';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/student/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/student/progress', label: 'Progress', icon: TrendingUp },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/enrolled-courses').then((res) => setEnrolled(res.data.data)).finally(() => setLoading(false));
  }, []);

  const completedCount = enrolled.filter((e) => e.completed).length;
  const inProgress = enrolled.filter((e) => !e.completed);
  const avgProgress = enrolled.length
    ? Math.round(enrolled.reduce((sum, e) => sum + e.completionPercent, 0) / enrolled.length)
    : 0;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Student" links={links} />
      <div className="flex-1 p-5 sm:p-8 max-w-6xl">
        <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mb-7">Here's where you left off.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, value: enrolled.length, label: 'Enrolled courses', tint: 'bg-brand-50 text-brand-600' },
            { icon: Flame, value: inProgress.length, label: 'In progress', tint: 'bg-amber-50 text-amber-600' },
            { icon: CheckCircle2, value: completedCount, label: 'Completed', tint: 'bg-emerald-50 text-emerald-600' },
            { icon: TrendingUp, value: `${avgProgress}%`, label: 'Avg. progress', tint: 'bg-accent-50 text-accent-600' },
          ].map(({ icon: Icon, value, label, tint }) => (
            <div key={label} className="card p-5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tint}`}><Icon size={17} /></div>
              <p className="text-2xl font-display font-bold text-ink">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Continue learning</h2>
          {enrolled.length > 0 && (
            <Link to="/student/my-courses" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : enrolled.length === 0 ? (
          <EmptyState
            icon={BookX}
            title="You haven't enrolled in any courses yet"
            description="Browse the catalog and enroll in your first course to see it here."
            action={<Link to="/courses" className="btn-primary">Browse courses</Link>}
          />
        ) : (
          <div className="space-y-3">
            {enrolled.map((e) => (
              <Link key={e.course._id} to={`/student/learn/${e.course._id}`} className="card-hover p-4 flex items-center gap-4">
                <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                  {e.course.thumbnail?.url ? <img src={e.course.thumbnail.url} className="w-full h-full object-cover" alt="" /> : <ImageOff size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{e.course.title}</p>
                  <p className="text-xs text-slate-400 mb-2">{e.course.instructor?.name}</p>
                  <ProgressBar percent={e.completionPercent} showLabel={false} size="sm" />
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-brand-600 text-sm font-medium shrink-0">
                  <PlayCircle size={16} /> {e.completed ? 'Review' : 'Continue'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
