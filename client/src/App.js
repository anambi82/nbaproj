import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PlayerStatsPage from './PlayerStatsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/player/:playerName" element={<PlayerStatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
