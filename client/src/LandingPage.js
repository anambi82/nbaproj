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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src='OneStopShot.png' className="h-50 w-auto"></img>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md px-4">
        <div>
          <label htmlFor="playerName" className="block text-lg font-medium text-gray-700">Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default LandingPage;
