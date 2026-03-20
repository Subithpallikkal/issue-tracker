import React from 'react';
import { IssuePriority, IssueStatus } from '@/types/issue';
import Button from './common/Button';

interface IssueFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  priority: IssuePriority;
  setPriority: (priority: IssuePriority) => void;
  status?: IssueStatus;
  setStatus?: (status: IssueStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  compact?: boolean;
}

const IssueForm: React.FC<IssueFormProps> = ({
  title, setTitle,
  description, setDescription,
  priority, setPriority,
  status,
  setStatus,
  onSubmit, isSubmitting, onCancel,
  compact = false,
}) => {
  const showStatus = status !== undefined && typeof setStatus === 'function';

  return (
    <div className="glass-card rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-card-inner rounded-3xl overflow-hidden">
        <div className="h-1.5 w-full bg-linear-to-r from-white/20 via-white/8 to-white/20" />
        <form onSubmit={onSubmit} className={compact ? 'p-5 sm:p-6 space-y-6' : 'p-8 space-y-10'}>
          <div className={compact ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'grid grid-cols-1 md:grid-cols-2 gap-10'}>
          <div className="space-y-3 col-span-2 md:col-span-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Issue Title</label>
            <input
              required
              className="w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block p-4 outline-none transition-all placeholder:text-white/20"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-3 col-span-2 md:col-span-1">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Urgency / Priority</label>
            <select
              className={`w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block outline-none transition-all appearance-none cursor-pointer ${compact ? 'p-3' : 'p-4'}`}
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
            >
              {Object.values(IssuePriority).map(p => (
                <option key={p} value={p} className="bg-sidebar text-white">
                  {p} Priority
                </option>
              ))}
            </select>
          </div>

          {showStatus && (
            <div className="space-y-3 col-span-2 md:col-span-1">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Status</label>
              <select
                className={`w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block outline-none transition-all appearance-none cursor-pointer ${compact ? 'p-3' : 'p-4'}`}
                value={status}
                onChange={e => setStatus(e.target.value as any)}
              >
                {Object.values(IssueStatus).map(s => (
                  <option key={s} value={s} className="bg-sidebar text-white">
                    {s.split('_').join(' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-3 col-span-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Detailed Description</label>
            <textarea
              required
              rows={compact ? 4 : 6}
              className={`w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-white/25 focus:border-white/20 block outline-none transition-all placeholder:text-white/20 resize-none ${compact ? 'p-3' : 'p-4'}`}
              placeholder="What happened? Steps to reproduce?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          </div>

          <div className={`flex justify-end gap-3 ${compact ? 'pt-5' : 'pt-8'} border-t border-border`}>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel} 
              className={`${compact ? 'px-5 py-2.5' : 'px-8 py-3'} rounded-xl border border-border text-text-muted hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest`}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              className={`${compact ? 'px-7 py-2.5' : 'px-12 py-3'} rounded-xl font-black`}
            >
              Save & Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;
