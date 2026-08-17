import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import {
  LayoutDashboard, BookOpen, PlusCircle, UserCircle, UploadCloud, ImageOff,
} from 'lucide-react';

const links = [
  { to: '/instructor/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/instructor/courses/new', label: 'Create Course', icon: PlusCircle },
  { to: '/instructor/profile', label: 'Profile', icon: UserCircle },
];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', difficulty: 'Beginner', price: 0 });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (thumbnail) formData.append('thumbnail', thumbnail);
      const res = await api.post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/instructor/courses/${res.data.data._id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Instructor" links={links} />
      <div className="flex-1 p-5 sm:p-8 max-w-2xl">
        <h1 className="text-2xl font-display font-bold mb-1">Create a course</h1>
        <p className="text-slate-500 mb-7">Start with the basics — you'll add modules and lectures next.</p>
        <Alert type="error" message={error} />
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Modern Web Development with the MERN Stack" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required rows={4} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will students learn in this course?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <input required className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web Development" />
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="select" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Price (USD, 0 for free)</label>
            <input type="number" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="label">Thumbnail image</label>
            <label className="flex items-center gap-4 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-brand-400 transition-colors">
              <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-slate-300 shrink-0">
                {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <ImageOff size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5"><UploadCloud size={15} /> Upload image</p>
                <p className="text-xs text-slate-400 mt-0.5">JPG or PNG, recommended 800×450</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Creating...' : 'Create course'}</button>
        </form>
      </div>
    </div>
  );
}
