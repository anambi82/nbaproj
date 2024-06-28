import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/player/${encodeURIComponent(playerName)}`);
  };

  return (
    <div>
      <h1>Enter Player Name</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="playerName">Player Name:</label>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LandingPage;
