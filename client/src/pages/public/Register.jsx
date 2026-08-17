import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, GraduationCap as GradIcon, Presentation } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form);
      navigate(data.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-brand-gradient text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-30" />
        <Link to="/" className="relative flex items-center gap-2 font-display font-bold text-xl">
          <span className="bg-white/15 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <GraduationCap size={20} />
          </span>
          LearnHub
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-display font-bold leading-tight mb-4">Start building new skills today</h2>
          <p className="text-brand-50/90 max-w-sm">Join as a student to start learning, or as an instructor to share what you know.</p>
        </div>
        <p className="relative text-xs text-brand-100/70">© {new Date().getFullYear()} LearnHub</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-display font-bold mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-7">Free forever. No credit card required.</p>
          <Alert type="error" message={error} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required className="input pl-10" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required className="input pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} required minLength={6} className="input pl-10 pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">At least 6 characters</p>
            </div>
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: GradIcon },
                  { value: 'instructor', label: 'Instructor', icon: Presentation },
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex flex-col items-center gap-2 border rounded-xl px-3 py-3.5 cursor-pointer text-sm transition-colors ${
                      form.role === value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" name="role" value={value} className="hidden" checked={form.role === value} onChange={() => setForm({ ...form, role: value })} />
                    <Icon size={18} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-sm text-slate-500 mt-5 text-center">
            Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
