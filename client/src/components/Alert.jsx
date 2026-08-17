import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onDismiss }) {
  if (!message) return null;
  const config = {
    error: { style: 'bg-red-50 text-red-700 border-red-100', Icon: AlertCircle },
    success: { style: 'bg-emerald-50 text-emerald-700 border-emerald-100', Icon: CheckCircle2 },
    info: { style: 'bg-brand-50 text-brand-700 border-brand-100', Icon: Info },
  }[type];
  const { style, Icon } = config;

  return (
    <div className={`border rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2.5 animate-fade-in ${style}`}>
      <Icon size={17} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
