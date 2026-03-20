'use client';

import React, { useEffect } from 'react';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  /** Use stronger destructive styling for delete/remove actions */
  destructive?: boolean;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  isLoading = false,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={() => !isLoading && onCancel()}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-sm glass-card rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="glass-card-inner rounded-2xl p-5 space-y-4">
          <h3 id="confirm-modal-title" className="text-white font-bold text-lg tracking-tight">
            {title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">{message}</p>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted border border-white/10 bg-linear-to-br from-white/6 via-white/3 to-white/8 backdrop-blur-md hover:text-white hover:border-white/16 transition-all disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => void onConfirm()}
              disabled={isLoading}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 ${
                destructive
                  ? 'border border-rose-400/30 bg-linear-to-br from-rose-500/30 via-rose-500/12 to-white/8 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.18)] hover:from-rose-500/40 hover:border-rose-400/40'
                  : 'btn-glass-primary'
              }`}
            >
              {isLoading ? '…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
