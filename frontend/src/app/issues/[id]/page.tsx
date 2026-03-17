'use client';

import { use, useEffect, useState } from 'react';
import { IssueWithDiscussions, IssueStatus, IssuePriority } from '@/types/issue';
import { api } from '@/services/api';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useRouter } from 'next/navigation';

export default function IssueDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: issueUid } = use(params);

  const [issue, setIssue] = useState<IssueWithDiscussions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [issueUid]);

  const fetchIssue = async () => {
    try {
      setIsLoading(true);
      const data = await api.getIssue(issueUid);
      setIssue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (!issue) return;
    try {
      await api.updateIssue(issueUid, { status: newStatus });
      setIssue({ ...issue, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const updatedIssue = await api.analyzeIssue(issueUid);
      setIssue(prev => prev ? { ...prev, aiAnalysis: updatedIssue.aiAnalysis } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !author) return;

    try {
      setIsSubmittingComment(true);
      const newComment = await api.createDiscussion({
        issueUid,
        content: comment,
        author,
      });
      setIssue(prev => prev ? {
        ...prev,
        discussions: [...prev.discussions, newComment]
      } : null);
      setComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20 animate-pulse text-gray-400">Loading issue details...</div>;
  if (!issue) return <div className="text-center py-20">Issue not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <button 
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to list
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{issue.title}</h1>
          <div className="flex gap-4 items-center mt-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              issue.priority === IssuePriority.URGENT ? 'bg-red-100 text-red-800' :
              issue.priority === IssuePriority.HIGH ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {issue.priority} Priority
            </span>
            <span className="text-gray-400 text-sm">
              Opened on {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <select 
            value={issue.status}
            onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-medium"
          >
            {Object.values(IssueStatus).map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
               Discussions
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm font-normal">
                {issue.discussions.length}
              </span>
            </h2>
            
            <div className="space-y-4">
              {issue.discussions.map((d) => (
                <div key={d.uid} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">{d.author}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(d.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{d.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 mt-8">
              <h3 className="font-semibold text-gray-900">Add an update</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                <textarea
                  placeholder="What's the latest update?"
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                <Button type="submit" isLoading={isSubmittingComment} className="w-full">
                  Post Update
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✨</span>
              <h2 className="text-lg font-bold text-blue-900">Gemini AI Analysis</h2>
            </div>
            
            {issue.aiAnalysis ? (
              <div className="space-y-4">
                <div className="prose prose-sm text-blue-800 whitespace-pre-wrap">
                  {issue.aiAnalysis}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto font-semibold"
                >
                  Refresh Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-blue-700">
                  Generate an automated analysis of this issue using Google's Gemini AI.
                </p>
                <Button 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Generate Insights
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-4 space-y-4 text-sm">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Issue Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-gray-900">{issue.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Priority:</span>
                <span className="font-medium text-gray-900">{issue.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium text-gray-900">{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-mono text-gray-400">#ISS-{issue.uid.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
