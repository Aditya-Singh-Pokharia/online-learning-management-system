import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';
import {
  LayoutDashboard, BookOpen, PlusCircle, UserCircle, Users2, ArrowLeft,
} from 'lucide-react';

const links = [
  { to: '/instructor/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/instructor/courses/new', label: 'Create Course', icon: PlusCircle },
  { to: '/instructor/profile', label: 'Profile', icon: UserCircle },
];

export default function ViewStudents() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${id}/students`).then((res) => setStudents(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Instructor" links={links} />
      <div className="flex-1 p-5 sm:p-8">
        <Link to="/instructor/courses" className="text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1.5 mb-3">
          <ArrowLeft size={14} /> Back to courses
        </Link>
        <h1 className="text-2xl font-display font-bold mb-1">Enrolled Students</h1>
        <p className="text-slate-500 mb-7">{students.length} student{students.length === 1 ? '' : 's'} enrolled</p>
        {loading ? (
          <Spinner />
        ) : students.length === 0 ? (
          <EmptyState icon={Users2} title="No students enrolled yet" description="Once students enroll in this course, they'll appear here with their progress." />
        ) : (
          <div className="card overflow-hidden overflow-x-auto">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Enrolled</th>
                  <th className="w-64">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden">
                          {s.student.avatar ? <img src={s.student.avatar} className="w-full h-full object-cover" alt="" /> : s.student.name?.[0]?.toUpperCase()}
                        </span>
                        <span className="font-medium text-ink">{s.student.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{s.student.email}</td>
                    <td className="text-slate-500">{new Date(s.enrolledAt).toLocaleDateString()}</td>
                    <td><ProgressBar percent={s.completionPercent} showLabel={false} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
