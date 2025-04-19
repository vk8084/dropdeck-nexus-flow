
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <div className="logo">DropDeck</div>
        <button className="profile-icon">👤</button>
      </header>
      
      <main>
        <div className="container">
          <h1>Welcome to DropDeck</h1>
          <p>Your crypto airdrop tracking platform</p>
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
