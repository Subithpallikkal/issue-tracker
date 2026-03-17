'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { IssuePriority } from '@/types/issue';
import Button from '@/components/common/Button';

export default function NewIssue() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>(IssuePriority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createIssue({ title, description, priority });
      router.push(`/issues/${res.uid}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Report New Issue</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="bg-blue-600 h-2 w-full"></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-gray-700 tracking-tight">Issue Title</label>
              <input
                required
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 transition-all"
                placeholder="Brief summary of the issue"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-gray-700 tracking-tight">Urgency / Priority</label>
              <select
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 transition-all"
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
              >
                {Object.values(IssuePriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-gray-700 tracking-tight">Detailed Description</label>
              <textarea
                required
                rows={6}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 transition-all"
                placeholder="What happened? Steps to reproduce?"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => router.back()} className="px-8 py-3 rounded-xl border border-gray-200">
              Discard
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="px-12 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all">
              Save & Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
