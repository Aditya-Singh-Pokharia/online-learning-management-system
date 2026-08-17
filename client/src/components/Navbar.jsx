import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Menu, X, ChevronDown, LayoutDashboard,
  BookOpen, LogOut, User as UserIcon,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const dashboardPath = user?.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard';
  const profilePath = user?.role === 'instructor' ? '/instructor/profile' : '/student/profile';

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200/70 sticky top-0 z-50">
      <div className="container-page">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-ink shrink-0">
            <span className="bg-brand-gradient text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lift">
              <GraduationCap size={20} strokeWidth={2.25} />
            </span>
            LearnHub
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/courses" className={isActive('/courses') ? 'nav-link-active' : 'nav-link'}>Courses</Link>
            {user?.role === 'student' && (
              <Link to="/student/dashboard" className={isActive('/student') ? 'nav-link-active' : 'nav-link'}>My Learning</Link>
            )}
            {user?.role === 'instructor' && (
              <Link to="/instructor/dashboard" className={isActive('/instructor') ? 'nav-link-active' : 'nav-link'}>Instructor Dashboard</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Get started</Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-700 max-w-[8rem] truncate">{user.name}</span>
                  <ChevronDown size={15} className={`text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 card p-1.5 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to={profilePath} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                      <UserIcon size={16} /> Profile
                    </Link>
                    {user.role === 'student' && (
                      <Link to="/student/my-courses" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                        <BookOpen size={16} /> My Courses
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-1">
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in">
          <div className="container-page py-3 flex flex-col gap-1">
            <Link to="/courses" className="nav-link">Courses</Link>
            {user?.role === 'student' && <Link to="/student/dashboard" className="nav-link">My Learning</Link>}
            {user?.role === 'instructor' && <Link to="/instructor/dashboard" className="nav-link">Instructor Dashboard</Link>}
            <div className="h-px bg-slate-100 my-2" />
            {!user ? (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary flex-1">Log in</Link>
                <Link to="/register" className="btn-primary flex-1">Sign up</Link>
              </div>
            ) : (
              <>
                <Link to={profilePath} className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="nav-link text-left text-red-600">Log out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
