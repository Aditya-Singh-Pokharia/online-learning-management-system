import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import {
  ImageOff, PlayCircle, FileQuestion, Users, Layers, BarChart3,
  ChevronDown, CheckCircle2,
} from 'lucide-react';

const difficultyColor = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
};

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${id}`)
      .then((res) => setCourse(res.data.data))
      .catch(() => setError('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') {
      setError('Only student accounts can enroll in courses.');
      return;
    }
    setEnrolling(true);
    setError('');
    try {
      await api.post(`/courses/${id}/enroll`);
      setSuccess('Enrolled! Redirecting to your course...');
      setTimeout(() => navigate(`/student/learn/${id}`), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Spinner />;
  if (!course) return <div className="container-page max-w-2xl py-16"><Alert type="error" message={error} /></div>;

  const totalLectures = course.modules?.reduce((sum, m) => sum + (m.lectures?.length || 0), 0) || 0;
  const totalQuizzes = course.modules?.filter((m) => m.quiz).length || 0;

  return (
    <div>
      {/* Header band */}
      <div className="bg-ink">
        <div className="container-page py-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 text-white">
            <div className="flex gap-2 mb-4">
              <span className="badge bg-white/10 text-white">{course.category}</span>
              <span className={`badge ${difficultyColor[course.difficulty] || 'badge-neutral'}`}>{course.difficulty}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight mb-3">{course.title}</h1>
            <p className="text-slate-300 leading-relaxed max-w-2xl">{course.description}</p>
            <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-semibold">
                  {course.instructor?.name?.[0]?.toUpperCase()}
                </span>
                {course.instructor?.name}
              </span>
              <span className="flex items-center gap-1.5"><Users size={15} /> {course.studentsEnrolled || 0} students</span>
              <span className="flex items-center gap-1.5"><PlayCircle size={15} /> {totalLectures} lectures</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-8 -mt-20 shadow-card border-4 border-white relative z-10">
            {course.thumbnail?.url ? (
              <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageOff size={32} /></div>
            )}
          </div>

          <h2 className="text-xl font-display font-semibold mb-1">Course content</h2>
          <p className="text-sm text-slate-500 mb-4">{course.modules?.length || 0} modules · {totalLectures} lectures · {totalQuizzes} quiz{totalQuizzes === 1 ? '' : 'zes'}</p>

          <div className="space-y-3">
            {course.modules?.length ? (
              course.modules.map((mod, idx) => (
                <div key={mod._id} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenModule(openModule === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/60 transition-colors"
                  >
                    <span className="font-medium text-ink flex items-center gap-2.5">
                      <Layers size={16} className="text-brand-500" /> {mod.title}
                    </span>
                    <ChevronDown size={17} className={`text-slate-400 transition-transform ${openModule === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openModule === idx && (
                    <ul className="px-5 pb-4 space-y-1 animate-fade-in">
                      {mod.lectures?.map((lec) => (
                        <li key={lec._id} className="flex items-center gap-2.5 text-sm text-slate-600 py-2 pl-1">
                          <PlayCircle size={15} className="text-slate-400 shrink-0" /> {lec.title}
                        </li>
                      ))}
                      {mod.quiz && (
                        <li className="flex items-center gap-2.5 text-sm text-slate-600 py-2 pl-1">
                          <FileQuestion size={15} className="text-slate-400 shrink-0" /> Quiz: {mod.quiz.title}
                        </li>
                      )}
                      {(!mod.lectures || mod.lectures.length === 0) && !mod.quiz && (
                        <li className="text-sm text-slate-400 py-2 pl-1">No content added yet</li>
                      )}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No modules added yet.</p>
            )}
          </div>

          {course.instructor?.bio && (
            <div className="card p-6 mt-8">
              <h3 className="font-display font-semibold mb-3">About the instructor</h3>
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-full bg-brand-gradient text-white flex items-center justify-center text-lg font-semibold shrink-0">
                  {course.instructor?.name?.[0]?.toUpperCase()}
                </span>
                <div>
                  <p className="font-medium text-ink">{course.instructor.name}</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{course.instructor.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 lg:-mt-20 relative z-10">
            <p className="text-3xl font-display font-bold mb-5">{course.price ? `$${course.price}` : 'Free'}</p>
            <Alert type="error" message={error} />
            <Alert type="success" message={success} />
            <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full mb-5">
              {enrolling ? 'Enrolling...' : 'Enroll now'}
            </button>
            <ul className="text-sm text-slate-600 space-y-3">
              <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-500" /> Lifetime access</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-500" /> Progress tracking</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-emerald-500" /> Certificate on completion</li>
            </ul>
            <div className="border-t border-slate-100 mt-5 pt-5 space-y-2.5 text-sm text-slate-500">
              <p className="flex items-center gap-2"><BarChart3 size={14} /> {course.difficulty} level</p>
              <p className="flex items-center gap-2"><Layers size={14} /> {course.modules?.length || 0} modules</p>
              <p className="flex items-center gap-2"><Users size={14} /> {course.studentsEnrolled || 0} students enrolled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
