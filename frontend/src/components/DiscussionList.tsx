import React from 'react';
import { Discussion } from '@/types/issue';

interface DiscussionListProps {
  discussions: Discussion[];
  onDelete: (uid: number) => void;
  onEdit: (uid: number , content: string) => void;
  editingUid: number | null;
  editContent: string;
  setEditContent: (content: string) => void;
  setEditingUid: (uid: number | null) => void;
}

const DiscussionList: React.FC<DiscussionListProps> = ({ 
  discussions, 
  onDelete, 
  onEdit, 
  editingUid, 
  editContent, 
  setEditContent,
  setEditingUid
}) => {
  return (
    <div className="space-y-6">
      {discussions.map((d) => {
        const isMe = d.author.toLowerCase() === 'you';
        return (
          <div key={d.uid} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex-0 flex items-center justify-center font-bold text-white overflow-hidden border border-border ${isMe ? 'bg-accent' : 'bg-slate-700'}`}>
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
                    className="w-full bg-sidebar border border-border rounded-xl p-3 text-sm text-white outline-none focus:ring-1 focus:ring-accent"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                        await onEdit(d.uid, editContent);
                        setEditingUid(null);
                      }}
                      className="bg-accent text-white px-3 py-1 rounded text-[10px] font-bold"
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
                  ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-accent/10' 
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
