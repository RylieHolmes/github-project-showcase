import React, { useState, useEffect } from 'react';
import type { GithubRepo } from '../types';
import { fetchRepoReadme } from '../services/githubService';
import LoadingSpinner from './LoadingSpinner';
import StarIcon from './icons/StarIcon';
import ForkIcon from './icons/ForkIcon';
import GithubIcon from './icons/GithubIcon';

// --- NEW IMPORTS ---
import { marked } from 'marked';
import { markedEmoji } from 'marked-emoji';
import DOMPurify from 'dompurify';

interface ProjectDetailProps {
  repo: GithubRepo;
  username: string;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ repo, username, onBack }) => {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReadme = async () => {
      try {
        setLoading(true);
        setError(null);
        const readmeContent = await fetchRepoReadme(username, repo.name);
        
        if (readmeContent) {
          // --- NEW MARKED CONFIGURATION ---
          
          // 1. Create a custom renderer to fix image paths
          const renderer = new marked.Renderer();
          renderer.image = (href, title, text) => {
            const imageUrl = href || '';
            // If the path is relative, convert it to an absolute GitHub URL
            if (!imageUrl.startsWith('http')) {
              // Assumes 'main' is the default branch. This works for most modern repos.
              const absoluteUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/main/${imageUrl.replace(/^\.\//, '')}`;
              return `<img src="${absoluteUrl}" alt="${text}" title="${title || ''}" class="rounded-lg shadow-md my-4" />`;
            }
            // Otherwise, use the original URL
            return `<img src="${imageUrl}" alt="${text}" title="${title || ''}" class="rounded-lg shadow-md my-4" />`;
          };

          // 2. Use the emoji extension and the custom renderer
          marked.use(markedEmoji({
            // Use GitHub-flavored emoji syntax
            github: true, 
          }));
          marked.setOptions({ renderer });
          
          // 3. Parse, sanitize, and set the final HTML
          const rawHtml = await marked.parse(readmeContent);
          const sanitizedHtml = DOMPurify.sanitize(rawHtml);
          setReadme(sanitizedHtml);
        } else {
          setReadme('<p class="text-center text-gray-400">No README.md found for this project.</p>');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Could not load README.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadReadme();
  }, [repo.name, repo.full_name, username]); // Added repo.full_name for safety

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-800/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <button
            onClick={onBack}
            className="text-purple-400 hover:text-purple-300 transition-colors mb-2"
           >
            &larr; Back to Projects
          </button>
          <h1 className="text-4xl font-bold text-white">{repo.name}</h1>
          <p className="text-gray-400 mt-1">{repo.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 flex-shrink-0">
            <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105"
            >
            <GithubIcon className="w-5 h-5" />
            View on GitHub
            </a>
        </div>
      </div>

      <div className="flex items-center gap-6 text-gray-300 border-y border-gray-700 py-4 mb-8">
        <span className="flex items-center gap-1">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <strong>{repo.stargazers_count}</strong>&nbsp;stars
        </span>
        <span className="flex items-center gap-1">
            <ForkIcon className="w-5 h-5 text-green-400" />
            <strong>{repo.forks_count}</strong>&nbsp;forks
        </span>
        {repo.language && (
          <span className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full bg-purple-500`}></span>
            <span>{repo.language}</span>
          </span>
        )}
      </div>
      
      <div className="prose prose-invert max-w-none mt-8">
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && readme && (
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: readme }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;