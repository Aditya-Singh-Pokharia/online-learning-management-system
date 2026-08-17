import React from 'react';
import { NavLink } from 'react-router-dom';

// Generic dashboard sidebar. `links` = [{ to, label, icon: LucideIcon, end? }]
// Desktop: fixed vertical sidebar. Mobile: horizontal scrollable tab bar.
export default function Sidebar({ title, links }) {
  return (
    <aside className="w-full md:w-64 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] bg-white border-b md:border-b-0 md:border-r border-slate-200">
      <p className="hidden md:block text-xs uppercase tracking-wide text-slate-400 font-semibold px-6 pt-6 pb-3">
        {title}
      </p>
      <nav className="flex md:flex-col gap-1 px-3 md:px-4 py-3 md:py-0 overflow-x-auto no-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {Icon && <Icon size={17} strokeWidth={2} />}
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
