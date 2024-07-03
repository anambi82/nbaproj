import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

function SeasonStatsPage() {
  const { playerName, seasonId } = useParams();
  const [seasonData, setSeasonData] = useState({});
  const [shotChartUrl, setShotChartUrl] = useState('');
  const [error, setError] = useState('');

  const fetchSeasonStats = useCallback(() => {
    fetch(`/seasonstats?player_name=${encodeURIComponent(playerName)}&season_id=${seasonId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
          setSeasonData({});
        } else {
          setError('');
          setSeasonData(json);
        }
      })
      .catch((error) => {
        console.error('Error fetching season stats:', error);
        setError('An error occurred while fetching season stats.');
        setSeasonData({});
      });
  }, [playerName, seasonId]);

  const fetchSeasonShotChart = useCallback(() => {
    fetch(`/plot?player_name=${encodeURIComponent(playerName)}&season_id=${seasonId}`)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setShotChartUrl(url);
      })
      .catch(error => {
        console.error('Error fetching the shot chart:', error);
      });
  }, [playerName, seasonId]);

  useEffect(() => {
    fetchSeasonStats();
    fetchSeasonShotChart();
  }, [fetchSeasonStats, fetchSeasonShotChart]);

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
      <h1>{playerName} - {seasonId} Season Stats</h1>
      {error && <div>{error}</div>}

      {seasonData.season_stats && Array.isArray(seasonData.season_stats) && (
        <div>
          <h2>Season Averages</h2>
          <h3>{seasonData.ppg} PPG</h3>
          <h3>{seasonData.rpg} RPG</h3>
          <h3>{seasonData.apg} APG</h3>

          <h2>Season Stats</h2>
          <table>
            <thead>
              <tr>
                {columnOrder.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seasonData.season_stats.map((stat, index) => (
                <tr key={index}>
                  {columnOrder.map((key) => (
                    <td key={key}>{stat[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shotChartUrl ? (
        <div>
          <h2>{playerName} {seasonId} Shot Chart</h2>
          <img
            src={shotChartUrl}
            alt={`${playerName} ${seasonId} Shot Chart`}
            style={{ width: '100%', height: 'auto', maxWidth: '1000px' }}
          />
        </div>
      ) : (
        <p>No shot chart available</p>
      )}
    </div>
  );
}

export default SeasonStatsPage;
