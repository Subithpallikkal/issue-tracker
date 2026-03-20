import React from 'react';
import { Discussion } from '@/types/issue';

interface DiscussionListProps {
  discussions: Discussion[];
  currentAuthor?: string;
  onDelete: (uid: number) => void;
  onEdit: (uid: number , content: string) => void;
  editingUid: number | null;
  editContent: string;
  setEditContent: (content: string) => void;
  setEditingUid: (uid: number | null) => void;
}

const DiscussionList: React.FC<DiscussionListProps> = ({ 
  discussions, 
  currentAuthor,
  onDelete, 
  onEdit, 
  editingUid, 
  editContent, 
  setEditContent,
  setEditingUid
}) => {
  const normalize = (value: string) => value.trim().toLowerCase();

  return (
    <div className="space-y-6">
      {discussions.map((d) => {
        const isMe = !!currentAuthor && normalize(d.author) === normalize(currentAuthor);
        return (
          <div key={d.uid} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex-0 flex items-center justify-center font-bold text-white overflow-hidden border ${isMe ? 'border-white/20 bg-linear-to-br from-white/20 to-white/8' : 'border-border bg-slate-700'}`}>
              {isMe ? '👤' : d.author[0].toUpperCase()}
            </div>
            <div className={`max-w-[80%] space-y-2 ${isMe ? 'items-end' : ''}`}>
              <div className={`flex items-center gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <span className="font-bold text-white text-sm">{isMe ? 'You' : d.author}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                  {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingUid(d.uid); setEditContent(d.content); }}
                      className="text-text-muted hover:text-accent transition-colors text-[10px]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(d.uid)}
                      className="text-text-muted hover:text-red-500 transition-colors text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {editingUid === d.uid ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full bg-sidebar border border-border rounded-xl p-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/25"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                        await onEdit(d.uid, editContent);
                        setEditingUid(null);
                      }}
                      className="btn-glass-primary px-3 py-1 rounded text-[10px]"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingUid(null)}
                      className="bg-white/5 text-text-muted px-3 py-1 rounded text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isMe 
                  ? 'text-white rounded-tr-none border border-white/15 bg-linear-to-br from-white/14 via-white/6 to-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.12)]' 
                  : 'bg-sidebar border border-border text-text-muted rounded-tl-none'
                }`}>
                  {d.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiscussionList;
