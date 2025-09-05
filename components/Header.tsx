import React from 'react';
import type { GithubUser } from '../types';
import GithubIcon from './icons/GithubIcon';
import { motion } from 'framer-motion';

interface HeaderProps {
  user: GithubUser;
}

const StatItem: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-2xl font-bold text-purple-400">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-800/30 mb-12"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <img
          src={user.avatar_url}
          alt={user.name}
          className="w-32 h-32 rounded-full border-4 border-purple-600 shadow-md"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white">{user.name}</h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-purple-400 hover:text-purple-300 transition-colors"
          >
            @{user.login}
          </a>
          <p className="mt-2 text-gray-300 max-w-xl">{user.bio}</p>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <GithubIcon className="w-5 h-5" />
            View Profile on GitHub
          </a>
        </div>
        <div className="flex gap-8 border-t-2 md:border-t-0 md:border-l-2 border-gray-700 pt-6 md:pt-0 md:pl-8">
          <StatItem value={user.public_repos} label="Repositories" />
          <StatItem value={user.followers} label="Followers" />
          <StatItem value={user.following} label="Following" />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;