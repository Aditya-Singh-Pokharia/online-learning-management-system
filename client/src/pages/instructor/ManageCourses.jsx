import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Alert from '../../components/Alert';
import {
  LayoutDashboard, BookOpen, PlusCircle, UserCircle, Pencil, Users2,
  Trash2, ImageOff,
} from 'lucide-react';

const links = [
  { to: '/instructor/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/instructor/courses/new', label: 'Create Course', icon: PlusCircle },
  { to: '/instructor/profile', label: 'Profile', icon: UserCircle },
];

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/courses/instructor/mine').then((res) => setCourses(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course and all its lectures/quizzes? This cannot be undone.')) return;
    setError('');
    try {
      await api.delete(`/courses/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Instructor" links={links} />
      <div className="flex-1 p-5 sm:p-8">
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">Manage Courses</h1>
            <p className="text-slate-500">{courses.length} course{courses.length === 1 ? '' : 's'} total</p>
          </div>
          <Link to="/instructor/courses/new" className="btn-primary"><PlusCircle size={16} /> New course</Link>
        </div>
        <Alert type="error" message={error} />
        {loading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses yet" action={<Link to="/instructor/courses/new" className="btn-primary">Create a course</Link>} />
        ) : (
          <div className="card overflow-hidden overflow-x-auto">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="flex items-center gap-3 min-w-[14rem]">
                        <div className="w-11 h-9 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                          {c.thumbnail?.url ? <img src={c.thumbnail.url} className="w-full h-full object-cover" alt="" /> : <ImageOff size={13} />}
                        </div>
                        <span className="font-medium text-ink truncate">{c.title}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{c.category}</td>
                    <td className="text-slate-500">{c.studentsEnrolled || 0}</td>
                    <td>
                      <span className={c.published ? 'badge-success' : 'badge-neutral'}>{c.published ? 'Published' : 'Draft'}</span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <Link to={`/instructor/courses/${c._id}/edit`} className="btn-secondary btn-sm"><Pencil size={13} /> Edit</Link>
                        <Link to={`/instructor/courses/${c._id}/students`} className="btn-secondary btn-sm"><Users2 size={13} /> Students</Link>
                        <button onClick={() => handleDelete(c._id)} className="btn-danger btn-sm"><Trash2 size={13} /></button>
                      </div>
                    </td>
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
