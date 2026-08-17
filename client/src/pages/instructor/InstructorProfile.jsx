import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import {
  LayoutDashboard, BookOpen, PlusCircle, UserCircle, Camera,
} from 'lucide-react';

const links = [
  { to: '/instructor/dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/instructor/courses/new', label: 'Create Course', icon: PlusCircle },
  { to: '/instructor/profile', label: 'Profile', icon: UserCircle },
];

export default function InstructorProfile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (avatarFile) formData.append('avatar', avatarFile);
      const res = await api.put('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(res.data.data);
      localStorage.setItem('lms_user', JSON.stringify(res.data.data));
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar title="Instructor" links={links} />
      <div className="flex-1 p-5 sm:p-8 max-w-xl">
        <h1 className="text-2xl font-display font-bold mb-1">Profile</h1>
        <p className="text-slate-500 mb-7">This is shown to students on your course pages</p>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xl font-semibold overflow-hidden">
                {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
              </div>
              <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer shadow-soft hover:bg-slate-50">
                <Camera size={12} className="text-slate-600" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Profile photo</p>
              <p className="text-xs text-slate-400">JPG or PNG, up to 3MB</p>
            </div>
          </div>
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-slate-50 text-slate-500" value={user?.email} disabled />
          </div>
          <div>
            <label className="label">Bio (shown on your course pages)</label>
            <textarea className="input" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save changes'}</button>
        </form>
      </div>
    </div>
  );
}
