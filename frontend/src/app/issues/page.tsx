'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { IssueCard, IssueForm } from '@/components';
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

  const handleDelete = async (e: React.MouseEvent, uid: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this issue?')) return;
    await deleteIssue(uid);
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
      <div className="space-y-1 px-4 md:px-0">
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-white">Issues</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Issues</h1>
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => {
                setFiltersOpen((v) => !v);
                setSortOpen(false);
              }}
              className="bg-sidebar border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 transition-all"
            >
              <span>≡</span> Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setSortOpen((v) => !v);
                setFiltersOpen(false);
              }}
              className="bg-sidebar border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 transition-all"
            >
              <span>⇵</span> Sort
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-accent/20 transition-all active:scale-95"
            >
              <span className="text-lg">+</span>
              New Issue
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
              <div className="absolute right-0 top-10 z-20 w-80 bg-sidebar border border-border rounded-2xl shadow-2xl p-4 space-y-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Search</div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, description, or #id"
                    className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-1 focus:ring-accent focus:border-accent block px-3 py-2 outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-1 focus:ring-accent focus:border-accent block px-3 py-2 outline-none transition-all"
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
                      className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-1 focus:ring-accent focus:border-accent block px-3 py-2 outline-none transition-all"
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
                    className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {sortOpen && (
              <div className="absolute right-0 top-10 z-20 w-64 bg-sidebar border border-border rounded-2xl shadow-2xl p-2">
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
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="border border-border/50 rounded-3xl bg-sidebar/20 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        
        {visibleIssues.length === 0 ? (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-32 h-32 rounded-full bg-sidebar flex items-center justify-center relative border border-border shadow-2xl">
              <div className="text-5xl opacity-50">🔍</div>
              <div className="absolute bottom-6 right-6 w-6 h-6 bg-accent rounded-full border-4 border-background flex items-center justify-center text-[10px] text-white font-bold">✕</div>
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
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-bold flex items-static gap-2 shadow-lg shadow-accent/20 transition-all active:scale-95"
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
              <IssueCard key={issue.uid} issue={issue} onDelete={handleDelete} />
            ))}

            {/* Pagination */}
            <div className="pt-6 flex items-center justify-between">
              <div className="text-[10px] font-bold text-text-muted">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-sidebar border border-border text-text-muted px-3 py-1.5 rounded-lg text-xs font-bold hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page * limit >= total}
                  onClick={() => setPage(page + 1)}
                  className="bg-sidebar border border-border text-text-muted px-3 py-1.5 rounded-lg text-xs font-bold hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-w-3xl w-full px-4">
            <div className="bg-sidebar border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="absolute right-4 top-4 text-text-muted hover:text-white text-sm font-bold"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="px-8 pt-8 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  <span className="text-accent text-xs">●</span>
                  <span>Quick Create</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">New Issue</h2>
                {createError && (
                  <div className="mt-2 text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
                    {createError}
                  </div>
                )}
              </div>

              <div className="px-8 pb-8">
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
                />
              </div>
            </div>
          </div>
        </div>
      )}
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
