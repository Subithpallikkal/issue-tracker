'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { IssueCard, IssueForm, ConfirmModal } from '@/components';
import { useIssues } from '@/hooks/useIssues';
import Link from 'next/link';
import { IssuePriority, IssueStatus } from '@/types/issue';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

function IssuesPageInner() {
  const { issues, isLoading, deleteIssue, error, page, limit, total, setPage, fetchIssues } = useIssues({ page: 1, limit: 10 });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<IssueStatus | 'ALL'>('ALL');
  const [priority, setPriority] = useState<IssuePriority | 'ALL'>('ALL');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'priority_desc' | 'priority_asc'>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createPriority, setCreatePriority] = useState<IssuePriority>(IssuePriority.MEDIUM);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteConfirmUid, setDeleteConfirmUid] = useState<number | null>(null);
  const [isDeletingIssue, setIsDeletingIssue] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, uid: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmUid(uid);
  };

  const confirmDeleteIssue = async () => {
    if (deleteConfirmUid == null) return;
    setIsDeletingIssue(true);
    try {
      await deleteIssue(deleteConfirmUid);
      setDeleteConfirmUid(null);
    } finally {
      setIsDeletingIssue(false);
    }
  };

  const allIssues = Array.isArray(issues) ? issues : [];

  const visibleIssues = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = allIssues.filter((i) => {
      const matchesQuery =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        String(i.uid).includes(q);

      const matchesStatus = status === 'ALL' || i.status === status;
      const matchesPriority = priority === 'ALL' || i.priority === priority;

      return matchesQuery && matchesStatus && matchesPriority;
    });

    const priorityRank: Record<IssuePriority, number> = {
      [IssuePriority.LOW]: 1,
      [IssuePriority.MEDIUM]: 2,
      [IssuePriority.HIGH]: 3,
      [IssuePriority.URGENT]: 4,
    };

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'priority_desc') return priorityRank[b.priority] - priorityRank[a.priority];
      if (sort === 'priority_asc') return priorityRank[a.priority] - priorityRank[b.priority];
      return 0;
    });

    return sorted;
  }, [allIssues, priority, query, sort, status]);

  const clearAll = () => {
    setQuery('');
    setStatus('ALL');
    setPriority('ALL');
    setSort('newest');
    // Clear header search query param too
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/issues${params.toString() ? `?${params.toString()}` : ''}`);
  };

  // Initialize / sync query from ?search= in URL (set by header)
  useEffect(() => {
    const current = searchParams.get('search') ?? '';
    setQuery(current);
  }, [searchParams]);

  const openCreateModal = () => {
    setCreateTitle('');
    setCreateDescription('');
    setCreatePriority(IssuePriority.MEDIUM);
    setCreateError(null);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);
    try {
      const created = await api.createIssue({
        title: createTitle,
        description: createDescription,
        priority: createPriority,
      });
      setShowCreateModal(false);
      await fetchIssues();
      router.push(`/issues/${created.uid}`);
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create issue.');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-text-muted">
        <div className="text-white font-bold text-lg mb-3">Error</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="space-y-1 px-1 sm:px-2 md:px-0">
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-white">Issues</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Issues</h1>
          <div className="grid grid-cols-3 sm:flex items-center gap-2 relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setFiltersOpen((v) => !v);
                setSortOpen(false);
              }}
              className="bg-sidebar border border-border px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-all"
            >
              <span>≡</span> Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setSortOpen((v) => !v);
                setFiltersOpen(false);
              }}
              className="bg-sidebar border border-border px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-all"
            >
              <span>⇵</span> Sort
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-glass-primary px-3 sm:px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span>
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New Issue</span>
            </button>

            {(filtersOpen || sortOpen) && (
              <button
                type="button"
                onClick={() => {
                  setFiltersOpen(false);
                  setSortOpen(false);
                }}
                className="fixed inset-0 cursor-default"
                aria-label="Close panels"
              />
            )}

            {filtersOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-12 z-20 w-full sm:w-80 glass-card rounded-2xl shadow-2xl">
                <div className="glass-card-inner rounded-2xl p-4 space-y-4">
                  <div className="space-y-2">
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Search</div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, description, or #id"
                    className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block px-3 py-2 outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block px-3 py-2 outline-none transition-all"
                    >
                      <option value="ALL" className="bg-sidebar text-white">All</option>
                      {Object.values(IssueStatus).map((s) => (
                        <option key={s} value={s} className="bg-sidebar text-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Priority</div>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block px-3 py-2 outline-none transition-all"
                    >
                      <option value="ALL" className="bg-sidebar text-white">All</option>
                      {Object.values(IssuePriority).map((p) => (
                        <option key={p} value={p} className="bg-sidebar text-white">{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      clearAll();
                      setFiltersOpen(false);
                    }}
                    className="text-text-muted hover:text-white text-xs font-bold transition-all underline underline-offset-4 decoration-text-muted"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="btn-glass-primary px-4 py-2 rounded-xl text-xs"
                  >
                    Apply
                  </button>
                  </div>
                </div>
              </div>
            )}

            {sortOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-12 z-20 w-full sm:w-64 glass-card rounded-2xl shadow-2xl">
                <div className="glass-card-inner rounded-2xl p-2">
                  {[
                  { id: 'newest', label: 'Newest first' },
                  { id: 'oldest', label: 'Oldest first' },
                  { id: 'priority_desc', label: 'Priority (high → low)' },
                  { id: 'priority_asc', label: 'Priority (low → high)' },
                  ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSort(opt.id as any);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      sort === opt.id ? 'bg-white/5 text-white' : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-3xl relative overflow-visible">
        <div className="glass-card-inner rounded-3xl p-3 sm:p-5 md:p-8 flex flex-col items-stretch justify-start overflow-visible">
        
        {visibleIssues.length === 0 ? (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-32 h-32 rounded-full bg-sidebar flex items-center justify-center relative border border-border shadow-2xl">
              <div className="text-5xl opacity-50">🔍</div>
              <div className="absolute bottom-6 right-6 w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center text-[10px] text-white font-bold bg-linear-to-br from-white/22 to-white/8">✕</div>
            </div>
            
            <div className="space-y-3 max-w-lg">
              <h2 className="text-2xl font-bold text-white">No issues found</h2>
              <p className="text-text-muted text-sm leading-relaxed">
                We couldn't find any issues matching your search or active filters. 
                Try adjusting your query or create a new issue to track your progress.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={openCreateModal}
                className="btn-glass-primary px-6 py-2.5 rounded-xl font-bold flex items-static gap-2"
              >
                <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs">+</span>
                Create New Issue
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="text-white hover:text-white/80 text-sm font-bold transition-all underline underline-offset-4 decoration-text-muted"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {visibleIssues.map((issue) => (
              <IssueCard key={issue.uid} issue={issue} onDelete={handleDeleteClick} />
            ))}

            {/* Pagination — extra bottom space on mobile so controls stay above fixed bottom nav */}
            <div className="pt-6 pb-2 md:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-[10px] font-bold text-text-muted">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </div>
              <div className="flex flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-sidebar border border-border text-text-muted px-3 py-2.5 sm:py-1.5 rounded-lg text-xs font-bold flex-1 sm:flex-none min-h-11 sm:min-h-0 sm:w-auto hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page * limit >= total}
                  onClick={() => setPage(page + 1)}
                  className="bg-sidebar border border-border text-text-muted px-3 py-2.5 sm:py-1.5 rounded-lg text-xs font-bold flex-1 sm:flex-none min-h-11 sm:min-h-0 sm:w-auto hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-w-xl w-full px-2 sm:px-3">
            <div className="glass-card rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
              <div className="glass-card-inner rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="absolute right-4 top-4 text-text-muted hover:text-white text-sm font-bold"
                  aria-label="Close"
                >
                  ✕
                </button>

                <div className="px-4 sm:px-5 pt-4 pb-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                    <span className="text-accent text-xs">●</span>
                    <span>Quick Create</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">New Issue</h2>
                  {createError && (
                    <div className="mt-2 text-xs font-bold text-red-300 bg-red-500/12 border border-red-400/25 rounded-xl px-4 py-2">
                      {createError}
                    </div>
                  )}
                </div>

                <div className="px-4 sm:px-5 pb-4">
                  <IssueForm
                    title={createTitle}
                    setTitle={setCreateTitle}
                    description={createDescription}
                    setDescription={setCreateDescription}
                    priority={createPriority}
                    setPriority={setCreatePriority}
                    onSubmit={handleCreateSubmit}
                    isSubmitting={isCreating}
                    onCancel={() => setShowCreateModal(false)}
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirmUid !== null}
        title="Delete this issue?"
        message="This can’t be undone. The issue and its activity will be removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isLoading={isDeletingIssue}
        onConfirm={confirmDeleteIssue}
        onCancel={() => {
          if (!isDeletingIssue) setDeleteConfirmUid(null);
        }}
      />
    </div>
  );
}

export default function IssuesPage() {
  return (
    <Suspense fallback={null}>
      <IssuesPageInner />
    </Suspense>
  );
}
