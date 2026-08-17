import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import { GraduationCap, Mail, Lock, Eye, EyeOff, PlayCircle, Award, TrendingUp } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-gradient text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-30" />
        <Link to="/" className="relative flex items-center gap-2 font-display font-bold text-xl">
          <span className="bg-white/15 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <GraduationCap size={20} />
          </span>
          LearnHub
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-display font-bold leading-tight mb-4">Welcome back to your learning journey</h2>
          <p className="text-brand-50/90 max-w-sm">Pick up right where you left off — your progress, quizzes and certificates are all waiting.</p>
          <div className="flex flex-col gap-3 mt-8">
            {[
              { icon: PlayCircle, text: 'Resume lectures instantly' },
              { icon: TrendingUp, text: 'Track your course progress' },
              { icon: Award, text: 'Access your certificates' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-brand-50/90">
                <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0"><Icon size={15} /></span>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-brand-100/70">© {new Date().getFullYear()} LearnHub</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-display font-bold mb-1">Log in</h1>
          <p className="text-slate-500 text-sm mb-7">Enter your details to continue learning.</p>
          <Alert type="error" message={error} />
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <input type={showPassword ? 'text' : 'password'} required className="input pl-10 pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <p className="text-sm text-slate-500 mt-5 text-center">
            Don't have an account? <Link to="/register" className="text-brand-600 font-semibold hover:underline">Sign up</Link>
          </p>
          <div className="text-xs text-slate-400 mt-8 border-t border-slate-100 pt-4 leading-relaxed">
            Test accounts (after running <code className="text-slate-500">npm run seed</code>):<br />
            instructor@example.com / password123<br />
            student@example.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}
