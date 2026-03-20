'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfilePanel from '@/components/profile/ProfilePanel';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    if (!isProfileOpen && !isOptionsOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsOptionsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOptionsOpen, isProfileOpen]);

  return (
    <header className="h-16 sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-30 px-3 sm:px-4 md:px-8 flex items-center justify-between md:justify-end gap-2">
      {/* Platform name: mobile only (sidebar shows branding on desktop) */}
      <div className="min-w-0 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
            🚀
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">Issue Tracker</span>
        </Link>
      </div>

      {/* Mobile: options menu (hamburger) */}
      <div className="relative shrink-0 md:hidden">
        <button
          type="button"
          onClick={() => setIsOptionsOpen((prev) => !prev)}
          className="p-2 rounded-lg text-text-muted hover:text-white transition-colors"
          aria-label="Open options"
        >
          <span className="text-2xl leading-none">☰</span>
        </button>

        {isOptionsOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setIsOptionsOpen(false)}
              aria-label="Close options"
            />
            <div className="absolute right-0 top-12 z-50 w-44 glass-card rounded-xl shadow-2xl">
              <div className="glass-card-inner rounded-xl p-2 space-y-1">
                {pathname?.startsWith('/issues/') && (
                  <Link
                    href="/issues/new"
                    onClick={() => setIsOptionsOpen(false)}
                    className="block w-full px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-all"
                  >
                    + New Issue
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-all"
                >
                  Profile
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop: direct actions (no hamburger) */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        {pathname?.startsWith('/issues/') && (
          <Link
            href="/issues/new"
            className="btn-glass-primary px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            New Issue
          </Link>
        )}
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
