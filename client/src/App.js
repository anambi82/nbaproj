import React, { useState, useEffect } from "react";
//commenting to test repo
function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/members")
      .then((res) => res.json())
      .then((json) => {
        setData(json.members || []);
      });
  }, []);

  return (
    <div>
      <h1>Members</h1>
      {data.map((member, i) => (
        <div key={i}>
          <h3>{member.name || member}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;
