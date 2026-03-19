'use client';

import React from 'react';

export default function ProfilePanel({ compact }: { compact?: boolean }) {
  return (
    <div className="glass-card rounded-3xl">
      <div className={`${compact ? 'glass-card-inner rounded-3xl p-5 space-y-4' : 'glass-card-inner rounded-3xl p-6 space-y-4'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-lg truncate">Jane Doe</div>
            <div className="text-text-muted text-sm font-bold">Pro Account</div>
          </div>
        </div>

        <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Plan</div>
            <div className="text-white font-bold">Pro</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Workspace</div>
            <div className="text-white font-bold">Issue Tracker</div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-text-muted text-sm leading-relaxed">
            Profile management UI is a placeholder in this version. Use the sidebar and issue pages to continue testing the product flow.
          </p>
        </div>
      </div>
    </div>
  );
}

