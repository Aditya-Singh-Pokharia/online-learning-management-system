import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import ProgressBar from '../../components/ProgressBar';
import Alert from '../../components/Alert';
import {
  ChevronLeft, ChevronRight, CheckCircle2, PlayCircle,
  FileQuestion, Award, ArrowLeft, Layers,
} from 'lucide-react';

export default function CourseLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);

  const findLecture = (courseObj, lectureId) => {
    for (const mod of courseObj.modules || []) {
      const found = mod.lectures?.find((l) => l._id === lectureId);
      if (found) return found;
    }
    return null;
  };

  const load = async () => {
    setLoading(true);
    try {
      const [courseRes, progressRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/progress/${courseId}`),
      ]);
      setCourse(courseRes.data.data);
      setProgress(progressRes.data.data);
      const firstLecture = courseRes.data.data.modules?.[0]?.lectures?.[0];
      setActiveLecture(
        progressRes.data.data.lastWatchedLecture
          ? findLecture(courseRes.data.data, progressRes.data.data.lastWatchedLecture._id) || firstLecture
          : firstLecture
      );
    } catch (err) {
      setError(err.response?.data?.message || 'You must be enrolled to view this course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const isCompleted = (lectureId) =>
    progress?.completedLectures?.some((l) => l._id === lectureId || l === lectureId);

  const flatLectures = useMemo(() => {
    const list = [];
    course?.modules?.forEach((mod) => mod.lectures?.forEach((lec) => list.push(lec)));
    return list;
  }, [course]);

  const activeIndex = flatLectures.findIndex((l) => l._id === activeLecture?._id);

  const markComplete = async () => {
    if (!activeLecture) return;
    setMarking(true);
    try {
      const res = await api.post(`/progress/${courseId}`, { lectureId: activeLecture._id, completed: true });
      setProgress(res.data.data);
    } finally {
      setMarking(false);
    }
  };

  const goTo = (lecture) => setActiveLecture(lecture);
  const goNext = () => activeIndex < flatLectures.length - 1 && goTo(flatLectures[activeIndex + 1]);
  const goPrev = () => activeIndex > 0 && goTo(flatLectures[activeIndex - 1]);

  if (loading) return <Spinner />;
  if (error) return <div className="container-page max-w-2xl py-16"><Alert type="error" message={error} /></div>;

  return (
    <div className="bg-slate-950 min-h-[calc(100vh-4rem)]">
      <div className="container-page py-4 flex items-center justify-between">
        <Link to={`/courses/${courseId}`} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white">
          <ArrowLeft size={15} /> Back to course
        </Link>
        <span className="text-sm text-slate-400 truncate max-w-xs">{course.title}</span>
      </div>

      <div className="container-page pb-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4 shadow-2xl">
            {activeLecture ? (
              <video key={activeLecture._id} controls className="w-full h-full" src={activeLecture.video?.url} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">Select a lecture to begin</div>
            )}
          </div>

          {activeLecture && (
            <div className="bg-slate-900 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-lg font-display font-semibold text-white">{activeLecture.title}</h1>
                  <p className="text-slate-400 text-sm mt-1">{activeLecture.description}</p>
                </div>
                {isCompleted(activeLecture._id) && (
                  <span className="badge-success shrink-0"><CheckCircle2 size={13} /> Completed</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5">
                <button onClick={goPrev} disabled={activeIndex <= 0} className="btn-secondary bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-30">
                  <ChevronLeft size={16} /> Previous
                </button>
                <button onClick={goNext} disabled={activeIndex >= flatLectures.length - 1} className="btn-secondary bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-30">
                  Next <ChevronRight size={16} />
                </button>
                <button onClick={markComplete} disabled={marking || isCompleted(activeLecture._id)} className="btn-primary ml-auto">
                  {isCompleted(activeLecture._id) ? <><CheckCircle2 size={16} /> Completed</> : marking ? 'Saving...' : 'Mark as complete'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-2xl p-5 mb-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Course progress</span>
              <span className="font-semibold text-white">{Math.round(progress?.completionPercent || 0)}%</span>
            </div>
            <ProgressBar percent={progress?.completionPercent || 0} showLabel={false} />
            {progress?.completed && (
              <Link to="/student/certificates" className="btn-primary w-full mt-4">
                <Award size={16} /> View your certificate
              </Link>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-2 max-h-[65vh] overflow-y-auto">
            {course.modules?.map((mod) => (
              <div key={mod._id} className="mb-1">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 px-3 py-3">
                  <Layers size={13} /> {mod.title}
                </p>
                <ul>
                  {mod.lectures?.map((lec) => (
                    <li key={lec._id}>
                      <button
                        onClick={() => goTo(lec)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                          activeLecture?._id === lec._id ? 'bg-brand-600/20 text-white' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {isCompleted(lec._id) ? (
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        ) : (
                          <PlayCircle size={16} className="text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{lec.title}</span>
                      </button>
                    </li>
                  ))}
                  {mod.quiz && (
                    <li>
                      <Link
                        to={`/student/quiz/${mod.quiz._id}/${courseId}`}
                        className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800"
                      >
                        <FileQuestion size={16} className="text-amber-400 shrink-0" /> {mod.quiz.title}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
