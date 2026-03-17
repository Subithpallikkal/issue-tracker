'use client';

import { useEffect, useState } from 'react';
import { Issue, IssuePriority, IssueStatus } from '@/types/issue';
import { api } from '@/services/api';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'ALL'>('ALL');

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    let result = issues;
    if (statusFilter !== 'ALL') result = result.filter(i => i.status === statusFilter);
    if (priorityFilter !== 'ALL') result = result.filter(i => i.priority === priorityFilter);
    setFilteredIssues(result);
  }, [issues, statusFilter, priorityFilter]);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const data = await api.getIssues();
      setIssues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const priorityColors = {
    [IssuePriority.LOW]: 'bg-slate-100 text-slate-700',
    [IssuePriority.MEDIUM]: 'bg-blue-50 text-blue-700',
    [IssuePriority.HIGH]: 'bg-orange-50 text-orange-700',
    [IssuePriority.URGENT]: 'bg-red-50 text-red-700',
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Dashboard</h1>
          <p className="text-sm text-gray-500">Manage and track your project tasks</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
          >
            <option value="ALL">All Priorities</option>
            {Object.values(IssuePriority).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <Link href="/issues/new">
            <Button className="shadow-sm">+ Create Issue</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredIssues.map((issue) => (
              <tr key={issue.uid} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{issue.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{issue.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/issues/${issue.uid}`} className="text-blue-600 hover:text-blue-900 text-sm font-semibold">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredIssues.length === 0 && (
          <div className="text-center py-12 text-gray-500 italic">No issues matching your filters.</div>
        )}
      </div>
    </div>
  );
}
