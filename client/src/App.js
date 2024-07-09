// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PlayerStatsPage from './PlayerStatsPage';
import SeasonStatsPage from './SeasonStatsPage';
import Header from './Header';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/player/:playerName" element={<PlayerStatsPage />} />
            <Route path="/player/:playerName/season/:seasonId" element={<SeasonStatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
