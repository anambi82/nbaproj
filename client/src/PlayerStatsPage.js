import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

function PlayerStatsPage() {
  const { playerName } = useParams();
  const [playerData, setPlayerData] = useState({});
  const [careerStats, setCareerStats] = useState([]);
  const [error, setError] = useState('');

  const fetchPlayerStats = useCallback(() => {
    fetch(`/playerstats?player_name=${encodeURIComponent(playerName)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
          setPlayerData({});
          setCareerStats([]);
        } else {
          setError('');
          setPlayerData({
            player: json.player,
            ppg: json.ppg,
            rpg: json.rpg,
            apg: json.apg,
          });
          setCareerStats(json.career_stats);
        }
      })
      .catch((error) => {
        console.error('Error fetching player stats:', error);
        setError('An error occurred while fetching player stats.');
        setPlayerData({});
        setCareerStats([]);
      });
  }, [playerName]);

  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]);

  const columnOrder = [
    "SEASON",
    "TEAM_ABBREVIATION",
    "PLAYER_AGE",
    "GP",
    "GS",
    "MIN",
    "PTS",
    "REB",
    "AST",
    "STL",
    "BLK",
    "TOV",
    "PF",
    "OREB",
    "DREB",
    "FGM",
    "FGA",
    "FG_PCT",
    "FG3M",
    "FG3A",
    "FG3_PCT",
    "FTM",
    "FTA",
    "FT_PCT",
  ];

  // Mapping for displaying headers and data
  const columnHeaderMapping = {
    "SEASON": "SEASON",
    "TEAM_ABBREVIATION": "TEAM",
    "PLAYER_AGE": "AGE",    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">{playerName} Stats</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {playerData.player && (
        <div className="text-center mb-4">
          <h2 className="text-3xl text-orange-500 font-bold">Career Averages</h2>
          <h3 className='text-2xl'>{playerData.ppg} PPG</h3>
          <h3 className='text-2xl'>{playerData.rpg} RPG</h3>
          <h3 className='text-2xl'>{playerData.apg} APG</h3>
        </div>
      )}

      {playerData.player && careerStats.length > 0 && (
        <div className="text-center">
          <h2 className="text-3xl text-orange-500  font-bold mb-4">Career Stats</h2>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {columnOrder.map((key) => (
                    <th key={key} className="border border-gray-300 bg-orange-200 p-2">
                      {columnHeaderMapping[key] ? columnHeaderMapping[key] : key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {careerStats.map((season, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    {columnOrder.map((key) => (
                      <td key={key} className="border border-gray-300 p-2">
                        {key === "SEASON" ? (
                          <Link to={`/player/${encodeURIComponent(playerName)}/season/${season["SEASON_ID"]}`} className="text-blue-500 hover:underline">{season["SEASON_ID"]}</Link>
                        ) : (
                          key === "PLAYER_AGE" ? season[key] : season[key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerStatsPage;
