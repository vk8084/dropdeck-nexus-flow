
import React, { useState } from 'react';
import { useProjectStats } from './hooks/useProjectStats';
import ProjectCard from './components/ProjectCard';
import InvestmentChart from './components/InvestmentChart';

const App: React.FC = () => {
  const { totalInvestment, totalEarnings } = useProjectStats();
  
  // Mock project data - in a real app this would come from an API or context
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Blockmesh', 
      description: 'Decentralized mesh network', 
      isFavorite: false,
      testnetUrl: 'https://blockmesh-testnet.example.com'
    },
    { 
      id: 2, 
      name: 'ChainFlow', 
      description: 'Cross-chain liquidity protocol', 
      isFavorite: true,
      testnetUrl: 'https://chainflow-testnet.example.com'
    },
    { 
      id: 3, 
      name: 'TokenVault', 
      description: 'Secure token storage solution', 
      isFavorite: false 
    }
  ]);
  
  const toggleFavorite = (id: number) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, isFavorite: !project.isFavorite } : project
    ));
  };

  return (
    <div className="app bg-gradient-to-br from-background to-secondary/5 min-h-screen">
      <header className="p-4 flex justify-between items-center border-b">
        <div className="logo text-xl font-bold">DropDeck</div>
        <button className="profile-icon text-2xl">👤</button>
      </header>
      
      <main className="pb-16 pt-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="stats-card p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">Total Investment</h3>
              <p className="text-2xl font-bold">${totalInvestment.toFixed(2)}</p>
            </div>
            <div className="stats-card p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">Total Earnings</h3>
              <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          <InvestmentChart />
          
          <h2 className="text-xl font-bold mt-8 mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard 
                key={project.id}
                name={project.name}
                description={project.description}
                isFavorite={project.isFavorite}
                onToggleFavorite={() => toggleFavorite(project.id)}
                testnetUrl={project.testnetUrl}
              />
            ))}
          </div>
        </div>
      </main>
      
      <nav id="bottom-nav" className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t flex justify-around p-2">
        <a href="#dashboard" className="nav-item active flex flex-col items-center p-2">
          <span>📊</span>
          <small>Dashboard</small>
        </a>
        <a href="#investment" className="nav-item flex flex-col items-center p-2">
          <span>💰</span>
          <small>Investment</small>
        </a>
        <a href="#explore" className="nav-item flex flex-col items-center p-2">
          <span>🔍</span>
          <small>Explore</small>
        </a>
        <a href="#stats" className="nav-item flex flex-col items-center p-2">
          <span>📈</span>
          <small>Stats</small>
        </a>
        <a href="#tasks" className="nav-item flex flex-col items-center p-2">
          <span>✅</span>
          <small>Tasks</small>
        </a>
        <a href="#news" className="nav-item flex flex-col items-center p-2">
          <span>📰</span>
          <small>News</small>
        </a>
      </nav>
    </div>
  );
};

export default App;
