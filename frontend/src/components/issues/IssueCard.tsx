import React from 'react';
import { Issue, IssuePriority, IssueStatus } from '../../types/issue';
import Card from '../common/Card';
import Link from 'next/link';

interface IssueCardProps {
  issue: Issue;
}

const priorityColors = {
  [IssuePriority.LOW]: 'bg-gray-100 text-gray-800',
  [IssuePriority.MEDIUM]: 'bg-blue-100 text-blue-800',
  [IssuePriority.HIGH]: 'bg-orange-100 text-orange-800',
  [IssuePriority.URGENT]: 'bg-red-100 text-red-800',
};

const statusColors = {
  [IssueStatus.OPEN]: 'bg-green-100 text-green-800',
  [IssueStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [IssueStatus.RESOLVED]: 'bg-indigo-100 text-indigo-800',
  [IssueStatus.CLOSED]: 'bg-gray-200 text-gray-800',
};

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Link href={`/issues/${issue.uid}`} passHref>
      <Card className="p-4 h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{issue.title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColors[issue.priority]}`}>
            {issue.priority}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {issue.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[issue.status]}`}>
            {issue.status.replace('_', ' ')}
          </span>
          <span className="text-gray-400 text-xs">
            {new Date(issue.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default IssueCard;
