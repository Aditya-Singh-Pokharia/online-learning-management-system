import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import {
  LayoutDashboard, BookOpen, PlusCircle, UserCircle, Users, GraduationCap,
  CheckCircle2, ImageOff, BarChart3,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const links = [
  { to: '/instructor/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/instructor/courses/new', label: 'Create Course', icon: PlusCircle },
  { to: '/instructor/profile', label: 'Profile', icon: UserCircle },
];

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/instructor/mine').then((res) => setCourses(res.data.data)).finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsEnrolled || 0), 0);
  const publishedCount = courses.filter((c) => c.published).length;

  const chartData = courses
    .slice()
    .sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0))
    .slice(0, 6)
    .map((c) => ({ name: c.title.length > 16 ? c.title.slice(0, 16) + '…' : c.title, students: c.studentsEnrolled || 0 }));

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Instructor" links={links} />
      <div className="flex-1 p-5 sm:p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">Instructor Dashboard</h1>
            <p className="text-slate-500">Manage your courses and track student engagement</p>
          </div>
          <Link to="/instructor/courses/new" className="btn-primary"><PlusCircle size={16} /> New course</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, value: courses.length, label: 'Total courses', tint: 'bg-brand-50 text-brand-600' },
            { icon: Users, value: totalStudents, label: 'Total students', tint: 'bg-accent-50 text-accent-600' },
            { icon: CheckCircle2, value: publishedCount, label: 'Published', tint: 'bg-emerald-50 text-emerald-600' },
            { icon: GraduationCap, value: courses.length - publishedCount, label: 'Drafts', tint: 'bg-amber-50 text-amber-600' },
          ].map(({ icon: Icon, value, label, tint }) => (
            <div key={label} className="card p-5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tint}`}><Icon size={17} /></div>
              <p className="text-2xl font-display font-bold text-ink">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {courses.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={17} className="text-brand-500" />
              <h2 className="font-display font-semibold">Students by course</h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Bar dataKey="students" fill="#4f6ef7" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Your courses</h2>
          {courses.length > 0 && <Link to="/instructor/courses" className="text-sm text-brand-600 font-medium hover:underline">Manage all</Link>}
        </div>
        {loading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Create your first course to get started."
            action={<Link to="/instructor/courses/new" className="btn-primary">Create a course</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((c) => (
              <div key={c._id} className="card-hover p-4 flex gap-4">
                <div className="w-20 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                  {c.thumbnail?.url ? <img src={c.thumbnail.url} className="w-full h-full object-cover" alt="" /> : <ImageOff size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mb-2">{c.studentsEnrolled || 0} students · {c.category}</p>
                  <div className="flex gap-2 text-sm">
                    <Link to={`/instructor/courses/${c._id}/edit`} className="btn-secondary btn-sm">Edit</Link>
                    <Link to={`/instructor/courses/${c._id}/students`} className="btn-secondary btn-sm">Students</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
