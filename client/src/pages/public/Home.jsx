import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CourseCard from '../../components/CourseCard';
import Spinner from '../../components/Spinner';
import {
  Search, PlayCircle, Award, TrendingUp, Users, BookOpen,
  Code2, Palette, LineChart, Megaphone, Camera, Briefcase,
  ShieldCheck, Sparkles, Star, ArrowRight,
} from 'lucide-react';

const categories = [
  { label: 'Web Development', icon: Code2 },
  { label: 'Design', icon: Palette },
  { label: 'Data & Analytics', icon: LineChart },
  { label: 'Marketing', icon: Megaphone },
  { label: 'Photography', icon: Camera },
  { label: 'Business', icon: Briefcase },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer',
    quote: 'The structured modules and quizzes kept me accountable. I finished my first course in three weeks and actually retained everything.',
  },
  {
    name: 'Daniel Osei',
    role: 'Product Designer',
    quote: 'Clean interface, real progress tracking, and a certificate I could actually put on LinkedIn. Exactly what I needed.',
  },
  {
    name: 'Maria Gonzalez',
    role: 'Data Analyst',
    quote: 'I like that I can pick up exactly where I left off on any device. The dashboard makes it obvious what to do next.',
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data.data.slice(0, 6))).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search ? `/courses?search=${encodeURIComponent(search)}` : '/courses');
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsEnrolled || 0), 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-400/30 rounded-full blur-3xl" />
        <div className="container-page relative py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 badge bg-white/15 text-white backdrop-blur-sm mb-6 animate-fade-in">
            <Sparkles size={13} /> New courses added every week
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto animate-fade-in-up">
            Learn new skills, on your own schedule
          </h1>
          <p className="text-lg text-brand-50/90 max-w-2xl mx-auto mt-5 mb-9 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            Video lectures, hands-on quizzes, and verified certificates from real instructors —
            all in one focused learning platform.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '140ms' }}>
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lift p-1.5 pl-4">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses, e.g. 'React' or 'Marketing'"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 py-2"
              />
              <button type="submit" className="btn-primary shrink-0">Search</button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Link to="/courses" className="btn bg-white text-brand-700 hover:bg-brand-50 shadow-lift">
              Browse courses <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn border border-white/40 text-white hover:bg-white/10">
              Get started free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-8 relative z-10">
        <div className="card p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
          {[
            { icon: BookOpen, value: `${courses.length || 0}+`, label: 'Active courses' },
            { icon: Users, value: `${totalStudents}+`, label: 'Students enrolled' },
            { icon: Award, value: '100%', label: 'Certified completion' },
            { icon: TrendingUp, value: '24/7', label: 'Self-paced access' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Icon size={19} />
              </div>
              <p className="text-2xl font-display font-bold text-ink">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <h2 className="text-2xl font-display font-bold text-center mb-2">Popular categories</h2>
        <p className="text-slate-500 text-center mb-8">Jump straight into what you want to learn</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              to={`/courses?category=${encodeURIComponent(label)}`}
              className="card-hover p-5 flex flex-col items-center gap-3 text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-gradient-soft text-brand-600 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="container-page py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold">Featured courses</h2>
            <p className="text-slate-500 mt-1">Hand-picked courses to get you started</p>
          </div>
          <Link to="/courses" className="hidden sm:flex items-center gap-1 text-brand-600 font-medium text-sm hover:underline">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <p className="text-slate-500 text-center py-10">No courses published yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
        )}
      </section>

      {/* Why choose us */}
      <section className="bg-white border-y border-slate-100 py-20 mt-8">
        <div className="container-page">
          <h2 className="text-2xl font-display font-bold text-center mb-2">Why learn with LearnHub</h2>
          <p className="text-slate-500 text-center mb-12">Built for people who want to actually finish what they start</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: PlayCircle, title: 'Self-paced video lectures', desc: 'Watch and rewatch lectures anytime — your progress and position are always saved automatically.' },
              { icon: ShieldCheck, title: 'Graded quizzes that matter', desc: 'Check your understanding after every module with instant, transparent scoring.' },
              { icon: Award, title: 'Certificates you can share', desc: 'Earn a verifiable, downloadable certificate the moment you complete a course.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center px-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-gradient text-white flex items-center justify-center shadow-lift mb-5">
                  <Icon size={24} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-20">
        <h2 className="text-2xl font-display font-bold text-center mb-2">What learners are saying</h2>
        <p className="text-slate-500 text-center mb-12">Real feedback from people building new skills</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 flex flex-col">
              <div className="flex gap-0.5 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                <span className="w-9 h-9 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-semibold">
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="bg-brand-gradient rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-30" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">Ready to start learning?</h2>
            <p className="text-brand-50/90 mb-7 max-w-xl mx-auto">
              Join thousands of learners building real skills — or share your expertise as an instructor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 shadow-lift">Create free account</Link>
              <Link to="/courses" className="btn border border-white/40 text-white hover:bg-white/10">Explore courses</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
