'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProfilePanel from '@/components/profile/ProfilePanel';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Keep header search in sync with /issues?search=
  useEffect(() => {
    if (pathname === '/issues') {
      const current = searchParams.get('search') ?? '';
      setTerm(current);
    }
  }, [pathname, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = term.trim();
    const params = new URLSearchParams();
    if (value) params.set('search', value);

    router.push(`/issues${params.toString() ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    if (!isProfileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isProfileOpen]);

  return (
    <header className="h-16 sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <form onSubmit={handleSubmit} className="max-w-xl w-full relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search issues by title, description, or #id..."
            className="w-full bg-sidebar border border-border rounded-lg py-1.5 pl-10 pr-4 text-xs md:text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-text-muted hover:text-white transition-colors">🔔</button>
        {pathname?.startsWith('/issues/') && (
          <Link
            href="/issues/new"
            className="bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2"
          >
            <span className="text-lg">+</span> New Issue
          </Link>
        )}

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="p-2 rounded-lg text-text-muted hover:text-white transition-colors"
            aria-label="Open profile"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sidebar/40 border border-border text-white font-bold text-xs">
              JD
            </span>
          </button>
        </div>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-60">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={() => setIsProfileOpen(false)}
            role="button"
            aria-label="Close profile"
            tabIndex={-1}
          />
          <div className="absolute right-4 top-16 w-[min(420px,calc(100vw-32px))] p-2">
            <div className="bg-background/95 border border-border rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="text-white font-bold">Profile</div>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="text-text-muted hover:text-white transition-colors font-bold"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <ProfilePanel compact />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
