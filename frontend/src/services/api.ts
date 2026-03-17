import { 
  Issue, 
  IssueWithDiscussions, 
  CreateIssueDto, 
  UpdateIssueDto, 
  CreateDiscussionDto, 
  Discussion 
} from '../types/issue';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || 'Network response was not ok');
  }
  return response.json();
}

export const api = {
  // Issues
  getIssues: async (): Promise<Issue[]> => {
    const response = await fetch(`${API_URL}/issues`);
    return handleResponse<Issue[]>(response);
  },

  getIssue: async (uid: string): Promise<IssueWithDiscussions> => {
    const response = await fetch(`${API_URL}/issues/${uid}`);
    return handleResponse<IssueWithDiscussions>(response);
  },

  createIssue: async (dto: CreateIssueDto): Promise<Issue> => {
    const response = await fetch(`${API_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return handleResponse<Issue>(response);
  },

  updateIssue: async (uid: string, dto: UpdateIssueDto): Promise<Issue> => {
    const response = await fetch(`${API_URL}/issues/${uid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return handleResponse<Issue>(response);
  },

  deleteIssue: async (uid: string): Promise<void> => {
    const response = await fetch(`${API_URL}/issues/${uid}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete issue');
  },

  analyzeIssue: async (uid: string): Promise<Issue> => {
    const response = await fetch(`${API_URL}/issues/${uid}/analyze`, {
      method: 'POST',
    });
    return handleResponse<Issue>(response);
  },

  // Discussions
  createDiscussion: async (dto: CreateDiscussionDto): Promise<Discussion> => {
    const response = await fetch(`${API_URL}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return handleResponse<Discussion>(response);
  },

  getDiscussions: async (issueUid: string): Promise<Discussion[]> => {
    const response = await fetch(`${API_URL}/discussions/issue/${issueUid}`);
    return handleResponse<Discussion[]>(response);
  },
};
