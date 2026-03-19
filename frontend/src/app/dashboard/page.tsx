'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { IssueCard } from '@/components';
import { useIssues } from '@/hooks/useIssues';
import { IssuePriority, IssueStatus } from '@/types/issue';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  // Fetch a small window of issues for summary cards + recent list.
  const { issues, isLoading, total } = useIssues({ page: 1, limit: 20 });

  const summary = useMemo(() => {
    const byStatus: Record<IssueStatus, number> = {
      [IssueStatus.OPEN]: 0,
      [IssueStatus.IN_PROGRESS]: 0,
      [IssueStatus.RESOLVED]: 0,
      [IssueStatus.CLOSED]: 0,
    };

    const byPriority: Record<IssuePriority, number> = {
      [IssuePriority.LOW]: 0,
      [IssuePriority.MEDIUM]: 0,
      [IssuePriority.HIGH]: 0,
      [IssuePriority.URGENT]: 0,
    };

    for (const i of issues) {
      byStatus[i.status] += 1;
      byPriority[i.priority] += 1;
    }

    const lastUpdated = issues
      .map((i) => i.updatedAt || i.createdAt)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

    return { byStatus, byPriority, lastUpdated };
  }, [issues]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="space-y-1 px-4 md:px-0">
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-white">Dashboard</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <Link
            href="/issues"
            className="bg-sidebar border border-border text-text-muted px-3 py-1.5 rounded-lg text-xs font-bold hover:text-white hover:bg-white/5 transition-all"
          >
            View Issues
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-0">
        <div className="bg-sidebar/20 border border-border rounded-3xl p-4 space-y-2">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Total Issues</div>
          <div className="text-white font-black text-2xl">{isLoading ? '...' : total}</div>
        </div>

        <div className="bg-sidebar/20 border border-border rounded-3xl p-4 space-y-2">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Open</div>
          <div className="text-white font-black text-2xl">{isLoading ? '...' : summary.byStatus[IssueStatus.OPEN]}</div>
        </div>

        <div className="bg-sidebar/20 border border-border rounded-3xl p-4 space-y-2">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">In Progress</div>
          <div className="text-white font-black text-2xl">
            {isLoading ? '...' : summary.byStatus[IssueStatus.IN_PROGRESS]}
          </div>
        </div>

        <div className="bg-sidebar/20 border border-border rounded-3xl p-4 space-y-2">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Urgent</div>
          <div className="text-white font-black text-2xl">
            {isLoading ? '...' : summary.byPriority[IssuePriority.URGENT]}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="border border-border/50 rounded-3xl bg-sidebar/20 p-6 space-y-4 mx-4 md:mx-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold">Recent Issues</div>
            <div className="text-[10px] font-bold text-text-muted">
              {summary.lastUpdated ? `Last activity: ${formatDate(summary.lastUpdated)}` : 'Loading activity...'}
            </div>
          </div>

          <Link
            href="/issues"
            className="text-text-muted hover:text-white text-xs font-bold underline underline-offset-4 decoration-text-muted"
          >
            Open full list
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-text-muted text-sm py-8">No issues yet.</div>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, 6).map((issue) => (
              <IssueCard key={issue.uid} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

