import React from 'react';

export default function ProgressBar({ percent = 0, className = '', showLabel = true, size = 'md' }) {
  const safe = Math.min(100, Math.max(0, Math.round(percent)));
  const height = size === 'sm' ? 'h-1.5' : 'h-2';
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-slate-700">{safe}%</span>
        </div>
      )}
      <div className={`progress-track ${height}`}>
        <div className="progress-fill" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
