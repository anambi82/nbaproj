import React, { useState } from "react";
//commenting to test repo
function App() {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [careerStats, setCareerStats] = useState([]);
  const [error, setError] = useState("");

  const fetchPlayerStats = () => {
    fetch(`/playerstats?player_name=${playerName}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.error) {
          setError(json.error);
          setPlayerData({});
          setCareerStats([]);
        } else {
          setError("");
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
        console.error("Error fetching player stats:", error);
        setError("An error occurred while fetching player stats.");
        setPlayerData({});
        setCareerStats([]);
      });
  };

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPlayerStats();
  };

  const columnOrder = [
    // "PLAYER_ID",
    "SEASON_ID",
    // "LEAGUE_ID",
    // "TEAM_ID",
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
      <h1>Player Stats</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="playerName">Enter Player Name:</label>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={handleInputChange}
        />
        <button type="submit">Get Stats</button>
      </form>

      {error && <div>{error}</div>}

      {playerData.player && (
        <div>
          <h1>{playerData.player}</h1>
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
                    <td key={key}>{season[key]}</td>
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

export default App;
