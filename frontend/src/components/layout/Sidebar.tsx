'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const workspaceLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/issues', label: 'Issues', icon: '✔' },
    // { href: '/projects', label: 'Projects', icon: '📁' },
    // { href: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  const teamLinks = [
    { href: '/engineering', label: 'Engineering', icon: '👥' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-sidebar border-r border-border z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold rotate-12">
            🚀
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Issue Tracker</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
        <section>
          <h3 className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Workspace</h3>
          <nav className="space-y-1">
            {workspaceLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  pathname === link.href 
                  ? 'bg-accent/10 text-accent font-semibold border-l-2 border-accent' 
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </section>

        <section>
          <h3 className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Teams</h3>
          <nav className="space-y-1">
            {teamLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-text-muted hover:bg-white/5 hover:text-white transition-all"
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">
            JD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">Jane Doe</p>
            <p className="text-[10px] text-text-muted truncate">Pro Account</p>
          </div>
        </div>
        <button className="text-text-muted hover:text-white transition-colors text-xl">⚙</button>
      </div>
    </aside>
  );
};

export default Sidebar;
