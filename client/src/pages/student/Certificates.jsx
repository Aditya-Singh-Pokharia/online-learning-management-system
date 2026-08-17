import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import {
  LayoutDashboard, BookOpen, TrendingUp, Award, UserCircle, ArrowUpRight,
} from 'lucide-react';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/student/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/student/progress', label: 'Progress', icon: TrendingUp },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates').then((res) => setCerts(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Student" links={links} />
      <div className="flex-1 p-5 sm:p-8">
        <h1 className="text-2xl font-display font-bold mb-1">My Certificates</h1>
        <p className="text-slate-500 mb-7">{certs.length} certificate{certs.length === 1 ? '' : 's'} earned</p>
        {loading ? (
          <Spinner />
        ) : certs.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certificates yet"
            description="Complete a course's lectures and quizzes to earn your first certificate."
            action={<Link to="/student/my-courses" className="btn-primary">Go to my courses</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {certs.map((c) => (
              <Link
                key={c._id}
                to={`/certificate/${c.certificateId}`}
                className="relative overflow-hidden card-hover p-6 border-2 border-brand-100"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-gradient-soft rounded-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white"><Award size={18} /></span>
                    <ArrowUpRight size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-brand-600 font-semibold tracking-wide mb-1.5">CERTIFICATE OF COMPLETION</p>
                  <p className="font-display font-bold text-lg text-ink">{c.courseName}</p>
                  <p className="text-sm text-slate-500 mt-1">Issued to {c.studentName}</p>
                  <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
                    ID: {c.certificateId} · {new Date(c.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
