import React from 'react';

interface AddDiscussionProps {
  comment: string;
  setComment: (comment: string) => void;
  onAdd: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const AddDiscussion: React.FC<AddDiscussionProps> = ({ comment, setComment, onAdd, isSubmitting }) => {
  return (
    <form onSubmit={onAdd} className="relative mt-10">
      <input
        placeholder="Write a comment..."
        required
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full bg-sidebar border border-border rounded-xl p-4 pr-14 text-sm text-white outline-none focus:ring-1 focus:ring-white/25 transition-all shadow-inner"
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-glass-primary absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-sm disabled:opacity-50"
      >
        {isSubmitting ? '...' : '➤'}
      </button>
    </form>
  );
};

export default AddDiscussion;
