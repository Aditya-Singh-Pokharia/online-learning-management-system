import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading...', fullHeight = true }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-400 ${fullHeight ? 'py-24' : 'py-8'}`}>
      <Loader2 size={26} className="animate-spin text-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
