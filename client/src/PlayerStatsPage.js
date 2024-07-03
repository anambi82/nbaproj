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
    "SEASON_ID",
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

  return (
    <div>
      <h1>{playerName} Stats</h1>
      {error && <div>{error}</div>}

      {playerData.player && (
        <div>
          <h2>Career Averages</h2>
          <h3>{playerData.ppg} PPG</h3>
          <h3>{playerData.rpg} RPG</h3>
          <h3>{playerData.apg} APG</h3>
        </div>
      )}

      {playerData.player && careerStats.length > 0 && (
        <div>
          <h2>Career Stats</h2>
          <table>
            <thead>
              <tr>
                {columnOrder.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {careerStats.map((season, index) => (
                <tr key={index}>
                  {columnOrder.map((key) => (
                    <td key={key}>
                      {key === "SEASON_ID" ? (
                        <Link to={`/player/${encodeURIComponent(playerName)}/season/${season[key]}`}>{season[key]}</Link>
                      ) : (
                        season[key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default PlayerStatsPage;
