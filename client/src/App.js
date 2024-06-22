import React, { useState, useEffect } from "react";
//commenting to test repo
function App() {
  const [data, setData] = useState([]);
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    fetch("/members")
      .then((res) => res.json())
      .then((json) => {
        setData(json.members || []);
      });
  }, []);

  useEffect(() => {
    fetch("/playerppg")
      .then((res) =>res.json())
      .then((json) => {
        console.log(json)
        setPlayerData(json)
      })
  }, [])

  return (
    <div>
      <h1>Members</h1>
      {data.map((member, i) => (
        <div key={i}>
          <h3>{member.name || member}</h3>
        </div>
      ))}
      <h1>Player PPG</h1>
      {playerData.player ? (
        <div>
          <h3>{playerData.player}</h3>
          <h3>{playerData.ppg}</h3>
        </div>
      ) : (
        <div>
          <h3>No player found</h3>
        </div>
      
      )}

    </div>
  );
}

export default App;
