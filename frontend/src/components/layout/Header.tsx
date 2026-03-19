'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState('');

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
      </div>
    </header>
  );
};

export default Header;
