import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, ImageOff, CheckCircle2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

const difficultyColor = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
};

// `to` lets callers point the card at a different route (e.g. the learning
// page instead of the public course-details page) for enrolled courses.
// `progress` (0-100, optional) renders a progress bar for "My Courses" views.
export default function CourseCard({ course, to, progress, completed }) {
  return (
    <Link to={to || `/courses/${course._id}`} className="card-hover overflow-hidden group flex flex-col">
      <div className="aspect-video bg-slate-100 overflow-hidden relative">
        {course.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImageOff size={28} />
          </div>
        )}
        {completed && (
          <span className="absolute top-2.5 right-2.5 badge-success bg-white/95 shadow-soft">
            <CheckCircle2 size={13} /> Completed
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
          <span className="badge-brand">{course.category}</span>
          <span className={difficultyColor[course.difficulty] || 'badge-neutral'}>{course.difficulty}</span>
        </div>

        <h3 className="font-display font-semibold text-ink leading-snug line-clamp-2 mb-1.5">{course.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-1">{course.description}</p>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="w-5 h-5 rounded-full bg-brand-gradient text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
            {course.instructor?.name?.[0]?.toUpperCase() || 'I'}
          </span>
          <span className="truncate">{course.instructor?.name || 'Instructor'}</span>
        </div>

        {typeof progress === 'number' ? (
          <ProgressBar percent={progress} size="sm" />
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><Users size={13} /> {course.studentsEnrolled || 0} students</span>
            <span className="flex items-center gap-1.5"><BarChart3 size={13} /> {course.difficulty}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
