import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300 mt-20">
      <div className="container-page py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-white mb-3">
            <span className="bg-brand-gradient w-8 h-8 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </span>
            LearnHub
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Learn practical skills from real instructors — video lectures, graded quizzes,
            and verified certificates, all in one focused platform.
          </p>
          <div className="flex gap-3 mt-5">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-4">Platform</p>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/courses" className="hover:text-white transition-colors">Browse courses</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Become an instructor</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Log in</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-4">Resources</p>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Help center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Certificates</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-4">Company</p>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} LearnHub. Built with the MERN stack.</span>
          <span>REST API · JWT Auth · Cloudinary</span>
        </div>
      </div>
    </footer>
  );
}
