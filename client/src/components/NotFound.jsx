import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center py-28 px-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 mb-6">
        <Compass size={30} />
      </div>
      <p className="text-7xl font-display font-bold text-gradient mb-3">404</p>
      <h1 className="text-xl font-semibold text-ink mb-2">Page not found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  );
}
