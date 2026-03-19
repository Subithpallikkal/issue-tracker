import { 
  Issue, 
  IssueWithDiscussions, 
  CreateIssueDto, 
  UpdateIssueDto, 
  CreateDiscussionDto, 
  Discussion,
  Paginated,
} from '../types/issue';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json().catch(() => null) as any;

  // Backend returns errors as:
  // { success: false, error: { message, ... } }
  if (!response.ok || (json && json.success === false)) {
    const message =
      json?.error?.message ||
      json?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  // Backend wraps success as:
  // { success: true, data: ... }
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }

  // Fallback for any unexpected response shapes.
  return json as T;
}

export const api = {
  // Issues
  getIssues: async (params?: { page?: number; limit?: number }): Promise<Paginated<Issue>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const response = await fetch(`${API_URL}/issues/get_all?page=${page}&limit=${limit}`);
    return handleResponse<Paginated<Issue>>(response);
  },

  getIssue: async (uid: number): Promise<IssueWithDiscussions> => {
    const response = await fetch(`${API_URL}/issues/get_by_id/${uid}`);
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

  updateIssue: async (uid: number, dto: UpdateIssueDto): Promise<Issue> => {
    const response = await fetch(`${API_URL}/issues/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      // Backend expects `uid` inside the request body (see `UpdateIssueDto`).
      body: JSON.stringify({ uid, ...dto }),
    });
    return handleResponse<Issue>(response);
  },

  deleteIssue: async (uid: number): Promise<void> => {
    const response = await fetch(`${API_URL}/issues/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    });
    if (!response.ok) throw new Error('Failed to delete issue');
  },

  analyzeIssue: async (uid: number, detailed = false): Promise<Issue> => {
    const response = await fetch(`${API_URL}/issues/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, detailed }),
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

  getDiscussions: async (
    issueUid: number,
    params?: { page?: number; limit?: number },
  ): Promise<Paginated<Discussion>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const response = await fetch(`${API_URL}/discussions/get_all_by_issue/${issueUid}?page=${page}&limit=${limit}`);
    return handleResponse<Paginated<Discussion>>(response);
  },

  updateDiscussion: async (uid: number, content: string): Promise<Discussion> => {
    const response = await fetch(`${API_URL}/discussions/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      // Backend expects `uid` inside the request body (see `UpdateDiscussionDto`).
      body: JSON.stringify({ uid, content }),
    });
    return handleResponse<Discussion>(response);
  },

  deleteDiscussion: async (uid: number): Promise<void> => {
    const response = await fetch(`${API_URL}/discussions/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    });
    if (!response.ok) throw new Error('Failed to delete discussion');
  },
};
