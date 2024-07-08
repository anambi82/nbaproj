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

  // Mapping for displaying headers and data
  const columnHeaderMapping = {
    "SEASON_ID": "SEASON",
    "TEAM_ABBREVIATION": "TEAM",
    "PLAYER_AGE": "AGE",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{playerName} - {seasonId} Season Stats</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {seasonData.season_stats && Array.isArray(seasonData.season_stats) && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Season Averages</h2>
          <h3>{seasonData.ppg} PPG</h3>
          <h3>{seasonData.rpg} RPG</h3>
          <h3>{seasonData.apg} APG</h3>

          <h2 className="text-xl font-bold mt-6 mb-4">Season Stats</h2>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {columnOrder.map((key) => (
                    <th key={key} className="border border-gray-300 p-2">
                      {columnHeaderMapping[key] ? columnHeaderMapping[key] : key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seasonData.season_stats.map((stat, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    {columnOrder.map((key) => (
                      <td key={key} className="border border-gray-300 p-2">
                        {key === "SEASON_ID" ? stat[key] : stat[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {shotChartUrl ? (
        <div className="text-center mt-8">
          <h2 className="text-xl font-bold">{playerName} {seasonId} Shot Chart</h2>
          <img
            src={shotChartUrl}
            alt={`${playerName} ${seasonId} Shot Chart`}
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '600px' }}
          />
        </div>
      ) : (
        <p className="text-center mt-8">No shot chart available</p>
      )}
    </div>
  );
}

export default SeasonStatsPage;
