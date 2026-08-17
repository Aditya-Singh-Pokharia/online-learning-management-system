import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="text-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 mb-4">
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
