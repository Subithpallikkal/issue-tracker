import React from 'react';
import { IssuePriority } from '@/types/issue';
import Button from './common/Button';

interface IssueFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  priority: IssuePriority;
  setPriority: (priority: IssuePriority) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const IssueForm: React.FC<IssueFormProps> = ({
  title, setTitle,
  description, setDescription,
  priority, setPriority,
  onSubmit, isSubmitting, onCancel
}) => {
  return (
    <div className="bg-sidebar border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-accent h-1.5 w-full"></div>
      <form onSubmit={onSubmit} className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Issue Title</label>
            <input
              required
              className="w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-accent focus:border-accent block p-4 outline-none transition-all placeholder:text-white/20"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-3 col-span-2 md:col-span-1">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Urgency / Priority</label>
            <select
              className="w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-accent focus:border-accent block p-4 outline-none transition-all appearance-none cursor-pointer"
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
          <div className="space-y-3 col-span-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Detailed Description</label>
            <textarea
              required
              rows={6}
              className="w-full bg-white/5 border border-border text-white text-sm rounded-2xl focus:ring-1 focus:ring-accent focus:border-accent block p-4 outline-none transition-all placeholder:text-white/20 resize-none"
              placeholder="What happened? Steps to reproduce?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-border">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel} 
            className="px-8 py-3 rounded-xl border border-border text-text-muted hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
          >
            Discard
          </Button>
          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            className="px-12 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-black shadow-lg shadow-accent/20 transition-all text-xs uppercase tracking-widest"
          >
            Save & Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;
