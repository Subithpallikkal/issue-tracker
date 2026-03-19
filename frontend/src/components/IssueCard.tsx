import React from 'react';
import { Issue } from '@/types/issue';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  onDelete?: (e: React.MouseEvent, uid: number) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onDelete }) => {
  return (
    <Link href={`/issues/${issue.uid}`} className="block group">
      <div className="glass-card rounded-xl transition-all">
        <div className="glass-card-inner rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all group-hover:border-accent/40">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-5 h-5 rounded border border-text-muted/50 flex items-center justify-center text-[8px] text-text-muted">✔</div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{issue.title}</h3>
              <p className="text-xs text-text-muted line-clamp-1">{issue.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:justify-end flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/5 text-text-muted border border-border">
              {issue.priority}
            </span>
            <span className="text-[10px] font-bold text-text-muted">{formatDate(issue.createdAt)}</span>
            {onDelete && (
              <button 
                onClick={(e) => onDelete(e, issue.uid)}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-text-muted hover:text-red-500 transition-all"
                title="Delete Issue"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
