import React from 'react';
import type { GithubRepo } from '../types';
import ProjectCard from './ProjectCard';
import { motion } from 'framer-motion';

interface ProjectGridProps {
  repos: GithubRepo[];
  onSelectRepo: (repo: GithubRepo) => void;
}

// Define animation variants for the container
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Each card will animate 0.15s after the previous one
      delayChildren: 0.3, // Wait for the header animation to get started
    },
  },
};

const ProjectGrid: React.FC<ProjectGridProps> = ({ repos, onSelectRepo }) => {
  if (repos.length === 0) {
    return <p className="text-center text-gray-400">No repositories found.</p>;
  }

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      animate="show"
    >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} onSelect={() => onSelectRepo(repo)} />
            ))}
        </div>
    </motion.div>
  );
};

export default ProjectGrid;```

#### Part B: Update the Individual Project Card
Now, **replace the entire contents** of your `components/ProjectCard.tsx` file. This adds the final piece that allows each card to animate as orchestrated by the grid.

**File: `components/ProjectCard.tsx`**
```typescript
import React from 'react';
import type { GithubRepo } from '../types';
import StarIcon from './icons/StarIcon';
import ForkIcon from './icons/ForkIcon';
import GithubIcon from './icons/GithubIcon';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  repo: GithubRepo;
  onSelect: () => void;
}

// Define the animation for each individual card
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
};

const ProjectCard: React.FC<ProjectCardProps> = ({ repo, onSelect }) => {
  const languageColor = 'bg-purple-500';

  return (
    <motion.div variants={cardVariants}>
      <button
        onClick={onSelect}
        className="block w-full text-left bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full border border-gray-700 hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label={`View details for project ${repo.name}`}
      >
        <div className="flex-grow">
          <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white mb-2">{repo.name}</h3>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label={`View ${repo.name} on GitHub (opens in a new tab)`}
              >
                  <GithubIcon className="w-6 h-6" />
              </a>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            {repo.description || 'No description provided.'}
          </p>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                  <ForkIcon className="w-4 h-4 text-green-400" />
                  {repo.forks_count}
              </span>
          </div>
          {repo.language && (
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${languageColor}`}></span>
              <span>{repo.language}</span>
            </div>
          )}
        </div>
      </button>
    </motion.div>
  );
};

export default ProjectCard;