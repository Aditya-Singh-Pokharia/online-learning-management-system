import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import {
  LayoutDashboard, BookOpen, PlusCircle, UserCircle, Layers, PlayCircle,
  Trash2, UploadCloud, FileQuestion, CheckCircle2, ImageOff, Video,
} from 'lucide-react';

const links = [
  { to: '/instructor/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/instructor/courses/new', label: 'Create Course', icon: PlusCircle },
  { to: '/instructor/profile', label: 'Profile', icon: UserCircle },
];

export default function EditCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const [moduleTitle, setModuleTitle] = useState('');
  const [lectureForms, setLectureForms] = useState({});
  const [quizForms, setQuizForms] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data.data);
      setForm({
        title: res.data.data.title,
        description: res.data.data.description,
        category: res.data.data.category,
        difficulty: res.data.data.difficulty,
        price: res.data.data.price,
        published: res.data.data.published,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(load, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setThumbPreview(URL.createObjectURL(file));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (thumbnail) formData.append('thumbnail', thumbnail);
      const res = await api.put(`/courses/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCourse((prev) => ({ ...prev, ...res.data.data }));
      setSuccess('Course details saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;
    setError('');
    try {
      await api.post(`/courses/${id}/modules`, { title: moduleTitle });
      setModuleTitle('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add module');
    }
  };

  const updateLectureForm = (moduleId, patch) => {
    setLectureForms((prev) => ({ ...prev, [moduleId]: { ...prev[moduleId], ...patch } }));
  };

  const handleAddLecture = async (moduleId) => {
    const lf = lectureForms[moduleId];
    if (!lf?.title || !lf?.file) {
      setError('Lecture title and video file are required');
      return;
    }
    updateLectureForm(moduleId, { uploading: true });
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', lf.title);
      formData.append('description', lf.description || '');
      formData.append('moduleId', moduleId);
      formData.append('video', lf.file);
      await api.post('/lectures', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLectureForms((prev) => ({ ...prev, [moduleId]: { title: '', description: '', file: null, uploading: false } }));
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Video upload failed');
      updateLectureForm(moduleId, { uploading: false });
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await api.delete(`/lectures/${lectureId}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const updateQuizForm = (moduleId, patch) => {
    setQuizForms((prev) => ({
      ...prev,
      [moduleId]: {
        title: '',
        passingScorePercent: 60,
        questions: [{ questionText: '', options: ['', ''], correctAnswerIndex: 0 }],
        ...prev[moduleId],
        ...patch,
      },
    }));
  };

  const addQuestion = (moduleId) => {
    const qf = quizForms[moduleId] || { questions: [] };
    updateQuizForm(moduleId, {
      questions: [...qf.questions, { questionText: '', options: ['', ''], correctAnswerIndex: 0 }],
    });
  };

  const updateQuestion = (moduleId, qIdx, patch) => {
    const qf = quizForms[moduleId];
    const questions = qf.questions.map((q, i) => (i === qIdx ? { ...q, ...patch } : q));
    updateQuizForm(moduleId, { questions });
  };

  const updateOption = (moduleId, qIdx, oIdx, value) => {
    const qf = quizForms[moduleId];
    const questions = qf.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const options = q.options.map((o, j) => (j === oIdx ? value : o));
      return { ...q, options };
    });
    updateQuizForm(moduleId, { questions });
  };

  const addOption = (moduleId, qIdx) => {
    const qf = quizForms[moduleId];
    const questions = qf.questions.map((q, i) => (i === qIdx ? { ...q, options: [...q.options, ''] } : q));
    updateQuizForm(moduleId, { questions });
  };

  const handleCreateQuiz = async (moduleId) => {
    const qf = quizForms[moduleId];
    if (!qf?.title || !qf.questions.length) {
      setError('Quiz title and at least one question are required');
      return;
    }
    setError('');
    try {
      await api.post('/quizzes', {
        title: qf.title,
        moduleId,
        passingScorePercent: qf.passingScorePercent,
        questions: qf.questions,
      });
      setQuizForms((prev) => ({ ...prev, [moduleId]: undefined }));
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create quiz');
    }
  };

  if (loading) return <Spinner />;
  if (!course || !form) return <div className="container-page max-w-2xl py-16"><Alert type="error" message={error} /></div>;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Instructor" links={links} />
      <div className="flex-1 p-5 sm:p-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Edit course</h1>
          <p className="text-slate-500">{course.title}</p>
        </div>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        {/* Course details */}
        <form onSubmit={handleSaveDetails} className="card p-6 space-y-5">
          <h2 className="font-display font-semibold flex items-center gap-2"><Layers size={17} className="text-brand-500" /> Course details</h2>
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={4} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="select" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="label">Price</label>
              <input type="number" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 mb-2.5 cursor-pointer">
              <input type="checkbox" className="accent-brand-600 w-4 h-4" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published (visible to students)
            </label>
          </div>
          <div>
            <label className="label">Replace thumbnail</label>
            <label className="flex items-center gap-4 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-brand-400 transition-colors">
              <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-slate-300 shrink-0">
                {thumbPreview || course.thumbnail?.url ? (
                  <img src={thumbPreview || course.thumbnail.url} alt="" className="w-full h-full object-cover" />
                ) : <ImageOff size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5"><UploadCloud size={15} /> Upload new image</p>
                <p className="text-xs text-slate-400 mt-0.5">Leave empty to keep the current thumbnail</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save details'}</button>
        </form>

        {/* Modules */}
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-5 flex items-center gap-2"><Layers size={17} className="text-brand-500" /> Modules, lectures &amp; quizzes</h2>

          <form onSubmit={handleAddModule} className="flex gap-2 mb-6">
            <input className="input" placeholder="New module title (e.g. Week 1: Basics)" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
            <button type="submit" className="btn-secondary whitespace-nowrap"><PlusCircle size={15} /> Add module</button>
          </form>

          <div className="space-y-5">
            {course.modules?.map((mod) => (
              <div key={mod._id} className="border border-slate-200 rounded-2xl p-5">
                <p className="font-medium text-ink mb-3 flex items-center gap-2"><Layers size={15} className="text-brand-400" /> {mod.title}</p>

                <ul className="space-y-1.5 mb-4">
                  {mod.lectures?.map((lec) => (
                    <li key={lec._id} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3.5 py-2.5">
                      <span className="flex items-center gap-2 text-slate-700"><PlayCircle size={14} className="text-slate-400" /> {lec.title}</span>
                      <button onClick={() => handleDeleteLecture(lec._id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                    </li>
                  ))}
                  {(!mod.lectures || mod.lectures.length === 0) && (
                    <li className="text-sm text-slate-400 px-1">No lectures yet</li>
                  )}
                </ul>

                <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Video size={13} /> Add lecture video</p>
                  <input
                    className="input"
                    placeholder="Lecture title"
                    value={lectureForms[mod._id]?.title || ''}
                    onChange={(e) => updateLectureForm(mod._id, { title: e.target.value })}
                  />
                  <textarea
                    className="input"
                    placeholder="Description (optional)"
                    rows={2}
                    value={lectureForms[mod._id]?.description || ''}
                    onChange={(e) => updateLectureForm(mod._id, { description: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="video/*"
                    className="text-sm text-slate-600 file:mr-3 file:btn-secondary file:btn-sm file:border-0 file:cursor-pointer"
                    onChange={(e) => updateLectureForm(mod._id, { file: e.target.files[0] })}
                  />
                  <button
                    onClick={() => handleAddLecture(mod._id)}
                    disabled={lectureForms[mod._id]?.uploading}
                    className="btn-secondary"
                  >
                    {lectureForms[mod._id]?.uploading ? 'Uploading video...' : <><UploadCloud size={15} /> Upload lecture</>}
                  </button>
                </div>

                {mod.quiz ? (
                  <p className="text-sm text-slate-500 flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-xl px-3.5 py-2.5">
                    <CheckCircle2 size={15} /> Quiz added: {mod.quiz.title}
                  </p>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><FileQuestion size={13} /> Add quiz</p>
                    <input
                      className="input"
                      placeholder="Quiz title"
                      value={quizForms[mod._id]?.title || ''}
                      onChange={(e) => updateQuizForm(mod._id, { title: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-500">Passing score %</label>
                      <input
                        type="number"
                        className="input w-24"
                        value={quizForms[mod._id]?.passingScorePercent ?? 60}
                        onChange={(e) => updateQuizForm(mod._id, { passingScorePercent: Number(e.target.value) })}
                      />
                    </div>

                    {(quizForms[mod._id]?.questions || [{ questionText: '', options: ['', ''], correctAnswerIndex: 0 }]).map((q, qIdx) => (
                      <div key={qIdx} className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2.5">
                        <input
                          className="input"
                          placeholder={`Question ${qIdx + 1}`}
                          value={q.questionText}
                          onChange={(e) => updateQuestion(mod._id, qIdx, { questionText: e.target.value })}
                        />
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${mod._id}-${qIdx}`}
                              className="accent-brand-600"
                              checked={q.correctAnswerIndex === oIdx}
                              onChange={() => updateQuestion(mod._id, qIdx, { correctAnswerIndex: oIdx })}
                            />
                            <input
                              className="input"
                              placeholder={`Option ${oIdx + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(mod._id, qIdx, oIdx, e.target.value)}
                            />
                          </div>
                        ))}
                        <button type="button" onClick={() => addOption(mod._id, qIdx)} className="text-xs text-brand-600 font-semibold">+ Add option</button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button type="button" onClick={() => addQuestion(mod._id)} className="btn-secondary btn-sm">+ Add question</button>
                      <button type="button" onClick={() => handleCreateQuiz(mod._id)} className="btn-primary btn-sm">Save quiz</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(!course.modules || course.modules.length === 0) && (
              <p className="text-sm text-slate-400">Add your first module above to start adding lectures and quizzes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
