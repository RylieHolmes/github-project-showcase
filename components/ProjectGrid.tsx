import React from 'react';
import type { GithubRepo } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  repos: GithubRepo[];
  onSelectRepo: (repo: GithubRepo) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ repos, onSelectRepo }) => {
  if (repos.length === 0) {
    return <p className="text-center text-gray-400">No repositories found.</p>;
  }

  return (
    <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-white">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} onSelect={() => onSelectRepo(repo)} />
            ))}
        </div>
    </div>
  );
};

export default ProjectGrid;