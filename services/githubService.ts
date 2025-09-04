
// Fix: Import GithubFile type
import type { GithubUser, GithubRepo, ReadmeData, GithubFile } from '../types';

const API_BASE_URL = 'https://api.github.com';

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 404) {
      // Don't throw for 404s, just return null as T
      return null as T;
    }
    const errorData = await response.json();
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const response = await fetch(`${API_BASE_URL}/users/${username}`);
  return handleResponse<GithubUser>(response);
};

export const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  // Fetch up to 100 repos, sorted by last updated
  const response = await fetch(`${API_BASE_URL}/users/${username}/repos?sort=updated&per_page=100`);
  // Fix: Ensure an array is always returned to prevent runtime errors.
  const repos = await handleResponse<GithubRepo[]>(response);
  return repos || [];
};

export const fetchRepoReadme = async (username: string, repoName: string): Promise<string | null> => {
    const response = await fetch(`${API_BASE_URL}/repos/${username}/${repoName}/readme`);
    const readmeData = await handleResponse<ReadmeData>(response);
    if (readmeData && readmeData.encoding === 'base64') {
        // Decode base64 content
        return atob(readmeData.content);
    }
    return null;
};

// Fix: Add fetchRepoContents to get repository file list for CodeRunner.
export const fetchRepoContents = async (username: string, repoName: string): Promise<GithubFile[]> => {
  const response = await fetch(`${API_BASE_URL}/repos/${username}/${repoName}/contents`);
  const contents = await handleResponse<GithubFile[]>(response);
  return contents || [];
};

// Fix: Add fetchRawFile to get raw content of a file from a URL for CodeRunner.
export const fetchRawFile = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch file content from ${url}. Status: ${response.status}`);
    }
    return response.text();
};
