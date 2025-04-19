import React from 'react';
import { useProjectStats } from './hooks/useProjectStats';
import ProjectCard from './components/ProjectCard';
import InvestmentChart from './components/InvestmentChart';

const App: React.FC = () => {
  const { totalInvestment, totalEarnings } = useProjectStats();

  return (
    <div className="app">
      <header>
        <div className="logo">DropDeck</div>
        <button className="profile-icon">👤</button>
      </header>
      
      <main className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 mb-6">
            <div className="stats-card">
              <h3>Total Investment</h3>
              <p>${totalInvestment.toFixed(2)}</p>
            </div>
            <div className="stats-card">
              <h3>Total Earnings</h3>
              <p>${totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          <InvestmentChart />
          
          
        </div>
      </main>
      
      <nav id="bottom-nav">
        <a href="#dashboard" className="nav-item active">
          <span>📊</span>
          <small>Dashboard</small>
        </a>
        <a href="#investment" className="nav-item">
          <span>💰</span>
          <small>Investment</small>
        </a>
        <a href="#explore" className="nav-item">
          <span>🔍</span>
          <small>Explore</small>
        </a>
        <a href="#stats" className="nav-item">
          <span>📈</span>
          <small>Stats</small>
        </a>
        <a href="#tasks" className="nav-item">
          <span>✅</span>
          <small>Tasks</small>
        </a>
        <a href="#news" className="nav-item">
          <span>📰</span>
          <small>News</small>
        </a>
      </nav>
    </div>
  );
};

export default App;
