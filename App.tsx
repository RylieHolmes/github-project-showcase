import React, { useState, useEffect } from 'react';
import { fetchGithubUser, fetchGithubRepos } from './services/githubService';
import type { GithubUser, GithubRepo } from './types';
import Header from './components/Header';
import ProjectGrid from './components/ProjectGrid';
import ProjectDetail from './components/ProjectDetail';
import LoadingSpinner from './components/LoadingSpinner';

const GITHUB_USERNAME = 'RylieHolmes';

type View = 'list' | 'detail';

const App: React.FC = () => {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userData, reposData] = await Promise.all([
          fetchGithubUser(GITHUB_USERNAME),
          fetchGithubRepos(GITHUB_USERNAME),
        ]);
        setUser(userData);
        // Filter out the repository that matches the username (the profile readme repo)
        const filteredRepos = reposData.filter(repo => repo.name !== GITHUB_USERNAME);
        setRepos(filteredRepos);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectRepo = (repo: GithubRepo) => {
    setSelectedRepo(repo);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedRepo(null);
    setCurrentView('list');
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      );
    }
    if (user) {
      if (currentView === 'list') {
        return (
          <>
            <Header user={user} />
            <ProjectGrid repos={repos} onSelectRepo={handleSelectRepo} />
          </>
        );
      }
      if (currentView === 'detail' && selectedRepo) {
        return (
          <ProjectDetail
            repo={selectedRepo}
            username={GITHUB_USERNAME}
            onBack={handleBackToList}
          />
        );
      }
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-gray-900 font-sans leading-normal tracking-wider">
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Showcase for {GITHUB_USERNAME}'s GitHub Projects</p>
        <p>Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;