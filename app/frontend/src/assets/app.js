import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('off');
  const ws = new WebSocket('ws://localhost:8080');

  useEffect(() => {
    // Fetch initial status from server
    axios.get('http://localhost:5000/status').then(res => {
      setStatus(res.data.status);
    });

    // WebSocket listener
    ws.onmessage = (event) => {
      const { device, status } = JSON.parse(event.data);
      if (device === 'light') {
        setStatus(status);
      }
    };

    return () => ws.close();
  }, []);

  const toggleLight = () => {
    const newStatus = status === 'on' ? 'off' : 'on';
    ws.send(JSON.stringify({ device: 'light', status: newStatus }));
  };

  return (
    <div className="App">
      <h1>Light is {status}</h1>
      <button onClick={toggleLight}>Toggle Light</button>
    </div>
  );
}

export default App;
