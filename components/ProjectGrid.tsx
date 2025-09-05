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
      staggerChildren: 0.15, // This will make each child animate 0.15s after the previous one
      delayChildren: 0.3, // Add a small delay before the children start animating
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

export default ProjectGrid;