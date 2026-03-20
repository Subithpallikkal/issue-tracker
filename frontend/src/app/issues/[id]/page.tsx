'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AddDiscussion, AIAnalysis, DiscussionList, IssueForm } from '@/components';
import type { Discussion, IssueWithDiscussions } from '@/types/issue';
import { IssuePriority, IssueStatus } from '@/types/issue';
import { formatDate } from '@/lib/utils';

export default function IssuePage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const rawId = params?.id;
  const isCreateMode = rawId === 'new';
  const uid = useMemo(() => {
    if (!rawId || isCreateMode) return NaN;
    const n = Number(rawId);
    return Number.isFinite(n) ? n : NaN;
  }, [isCreateMode, rawId]);

  const [issue, setIssue] = useState<IssueWithDiscussions | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discPage, setDiscPage] = useState(1);
  const [discLimit] = useState(10);
  const [discTotal, setDiscTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUid, setEditingUid] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const [isEditingIssue, setIsEditingIssue] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<IssuePriority | null>(null);
  const [editStatus, setEditStatus] = useState<IssueStatus>(IssueStatus.OPEN);
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiDetailed, setAiDetailed] = useState<string | null>(null);
  const [isAnalyzingSummary, setIsAnalyzingSummary] = useState(false);
  const [isAnalyzingDetailed, setIsAnalyzingDetailed] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    // Persist a stable author name per browser/device for discussion attribution.
    const key = 'issue-tracker-author-name';
    const existing = window.localStorage.getItem(key)?.trim();
    if (existing) {
      setAuthorName(existing);
      return;
    }

    const generated = `User-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    window.localStorage.setItem(key, generated);
    setAuthorName(generated);
  }, []);

  useEffect(() => {
    if (isCreateMode) {
      // In create mode, we don't fetch an existing issue.
      setIsLoading(false);
      setIssue(null);
      setDiscussions([]);
      setDiscTotal(0);
      setEditTitle('');
      setEditDescription('');
      setEditPriority(IssuePriority.MEDIUM);
      setEditStatus(IssueStatus.OPEN);
      setIsEditingIssue(true);
      return;
    }

    const fetchData = async () => {
      if (!Number.isFinite(uid)) {
        setError('Invalid issue id.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getIssue(uid);
        setIssue(res);
        // Discussions are paginated via the discussions endpoint now.
        const disc = await api.getDiscussions(uid, { page: discPage, limit: discLimit });
        setDiscussions(disc.items || []);
        setDiscTotal(disc.total || 0);

        // Initialize edit fields when issue loads
        if (!isEditingIssue) {
          setEditTitle(res.title);
          setEditDescription(res.description);
          setEditPriority(res.priority);
          setEditStatus(res.status);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load issue.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [discLimit, discPage, isCreateMode, uid]);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(uid)) return;

    const trimmed = comment.trim();
    if (!trimmed) return;

    void (async () => {
      setIsSubmitting(true);
      setError(null);
      try {
        const created = await api.createDiscussion({
          issueUid: uid,
          content: trimmed,
          author: authorName || 'Anonymous',
        });
        setDiscussions((prev) => [...prev, created]);
        setComment('');
      } catch (e: any) {
        setError(e?.message || 'Failed to add discussion.');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const runSummaryAnalysis = () => {
    if (!Number.isFinite(uid)) return;

    setAiError(null);
    setIsAnalyzingDetailed(false);
    setAiDetailed(null);
    setIsAnalyzingSummary(true);

    void (async () => {
      try {
        const res = await api.analyzeIssue(uid, false);
        setAiSummary(res.aiAnalysis ?? null);
      } catch (e: any) {
        setAiSummary(null);
        setAiError(e?.message || 'Failed to analyze issue.');
      } finally {
        setIsAnalyzingSummary(false);
      }
    })();
  };

  const runDetailedAnalysis = () => {
    if (!Number.isFinite(uid)) return;

    setAiError(null);
    setIsAnalyzingDetailed(true);

    void (async () => {
      try {
        const res = await api.analyzeIssue(uid, true);
        setAiDetailed(res.aiAnalysis ?? null);
      } catch (e: any) {
        setAiDetailed(null);
        setAiError(e?.message || 'Failed to run detailed analysis.');
      } finally {
        setIsAnalyzingDetailed(false);
      }
    })();
  };

  const handleDeleteDiscussion = async (discussionUid: number) => {
    try {
      await api.deleteDiscussion(discussionUid);
      setDiscussions((prev) => prev.filter((d) => d.uid !== discussionUid));
      setDiscTotal((t) => Math.max(0, t - 1));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete discussion.');
    }
  };

  const handleEditDiscussion = async (discussionUid: number, content: string) => {
    try {
      const updated = await api.updateDiscussion(discussionUid, content);
      setDiscussions((prev) =>
        prev.map((d) => (d.uid === discussionUid ? { ...d, content: updated.content } : d)),
      );
    } catch (e: any) {
      setError(e?.message || 'Failed to update discussion.');
    }
  };

  const handleStartEditIssue = () => {
    if (!issue) return;
    setEditTitle(issue.title);
    setEditDescription(issue.description);
    setEditPriority(issue.priority);
    setEditStatus(issue.status);
    setIsEditingIssue(true);
  };

  const handleUpdateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPriority) return;

    setIsUpdatingIssue(true);
    setError(null);
    try {
      if (isCreateMode) {
        const created = await api.createIssue({
          title: editTitle,
          description: editDescription,
          priority: editPriority,
        });
        router.push(`/issues/${created.uid}`);
        return;
      }

      if (!Number.isFinite(uid) || !issue) return;

      const updated = await api.updateIssue(uid, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        status: editStatus,
      });
      setIssue((prev) =>
        prev ? { ...prev, ...updated, discussions: prev.discussions } : { ...(updated as any), discussions: [] },
      );
      setIsEditingIssue(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to update issue.');
    } finally {
      setIsUpdatingIssue(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-text-muted">
        <div className="text-white font-bold text-lg mb-3">Error</div>
        <div>{error}</div>
      </div>
    );
  }

  if (!isCreateMode && !issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-text-muted">
        <div className="text-white font-bold text-lg mb-3">Issue not found</div>
      </div>
    );
  }

  const safeIssue = issue as IssueWithDiscussions | null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <div className="space-y-2 pt-8">
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted mb-1">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/issues" className="hover:text-white transition-colors">
            Issues
          </Link>
          <span>›</span>
          {isCreateMode ? (
            <span className="text-white">New issue</span>
          ) : safeIssue ? (
            <span className="text-white">Issue #{safeIssue.uid}</span>
          ) : null}
        </div>

        {!isEditingIssue && !isCreateMode && safeIssue ? (
          <>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {safeIssue.title}
                </h1>
                <p className="text-text-muted text-sm leading-relaxed">{safeIssue.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2 md:pt-1 md:justify-end">
                <button
                  type="button"
                  onClick={handleStartEditIssue}
                  className="bg-sidebar border border-border text-text-muted px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-white hover:bg-white/5 transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={runSummaryAnalysis}
                  disabled={isAnalyzingSummary || isAnalyzingDetailed}
                  className="btn-glass-primary px-3 py-2 rounded-lg text-xs"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={isAnalyzingSummary ? 'animate-spin' : ''}
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2Z"
                        fill="currentColor"
                        opacity="0.95"
                      />
                      <path
                        d="M5 13l.8 2.4L8 16l-2.2.6L5 19l-.8-2.4L2 16l2.2-.6L5 13Z"
                        fill="currentColor"
                        opacity="0.8"
                      />
                      <path
                        d="M18 12l.9 2.7L22 15.6l-3.1.9L18 19l-.9-2.5-3.1-.9 3.1-.9.9-2.7Z"
                        fill="currentColor"
                        opacity="0.8"
                      />
                    </svg>
                    {isAnalyzingSummary ? 'Analyzing...' : 'AI Analyze'}
                  </span>
                </button>
              </div>
            </div>

            {safeIssue && (
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/5 text-text-muted border border-border">
                  {safeIssue.priority}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/5 text-text-muted border border-border">
                  {safeIssue.status}
                </span>
                <span className="text-[10px] font-bold text-text-muted">
                  Created {formatDate(safeIssue.createdAt)}
                </span>
                {safeIssue.updatedAt && (
                  <span className="text-[10px] font-bold text-text-muted">
                    Updated {formatDate(safeIssue.updatedAt)}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="pt-4 space-y-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {isCreateMode ? 'Report New Issue' : safeIssue?.title}
            </h1>
            <IssueForm
              title={editTitle}
              setTitle={setEditTitle}
              description={editDescription}
              setDescription={setEditDescription}
              priority={editPriority ?? (issue ? issue.priority : IssuePriority.MEDIUM)}
              setPriority={(p) => setEditPriority(p)}
              status={!isCreateMode ? editStatus : undefined}
              setStatus={!isCreateMode ? setEditStatus : undefined}
              onSubmit={handleUpdateIssue}
              isSubmitting={isUpdatingIssue}
              onCancel={() => {
                if (isCreateMode) {
                  router.push('/issues');
                } else {
                  setIsEditingIssue(false);
                }
              }}
            />
          </div>
        )}

        {(isAnalyzingSummary || aiSummary) && (
          <div className="pt-6">
            {aiError && (
              <div className="mb-4 text-sm font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {aiError}
              </div>
            )}

            <AIAnalysis
              analysis={aiSummary ?? undefined}
              isAnalyzing={isAnalyzingSummary}
              variant="summary"
            />

            {aiSummary && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={runDetailedAnalysis}
                  disabled={isAnalyzingDetailed || isAnalyzingSummary}
                  className="bg-sidebar border border-border text-text-muted px-4 py-2 rounded-lg text-xs font-bold hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzingDetailed ? 'Analyzing detailed...' : 'Detailed analyze'}
                </button>
              </div>
            )}

            {(isAnalyzingDetailed || aiDetailed) && (
              <div className="mt-6">
                <AIAnalysis
                  analysis={aiDetailed ?? undefined}
                  isAnalyzing={isAnalyzingDetailed}
                  variant="detailed"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Discussions */}
      <div className="glass-card rounded-3xl">
        <div className="glass-card-inner rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-bold">Discussions</div>
          <div className="text-[10px] font-bold text-text-muted">{discTotal} comments</div>
        </div>

        {discussions.length === 0 ? (
          <div className="text-text-muted text-sm py-10">No discussions yet.</div>
        ) : (
          <DiscussionList
            discussions={discussions}
            currentAuthor={authorName}
            onDelete={handleDeleteDiscussion}
            onEdit={handleEditDiscussion}
            editingUid={editingUid}
            editContent={editContent}
            setEditContent={setEditContent}
            setEditingUid={setEditingUid}
          />
        )}

        {/* Discussion pagination */}
        {discTotal > discLimit && (
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-[10px] font-bold text-text-muted">
              Page {discPage} of {Math.max(1, Math.ceil(discTotal / discLimit))}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                disabled={discPage <= 1}
                onClick={() => setDiscPage((p) => Math.max(1, p - 1))}
                className="bg-sidebar border border-border text-text-muted px-3 py-1.5 rounded-lg text-xs font-bold w-full sm:w-auto hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={discPage * discLimit >= discTotal}
                onClick={() => setDiscPage((p) => p + 1)}
                className="bg-sidebar border border-border text-text-muted px-3 py-1.5 rounded-lg text-xs font-bold w-full sm:w-auto hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <AddDiscussion comment={comment} setComment={setComment} onAdd={onAdd} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}