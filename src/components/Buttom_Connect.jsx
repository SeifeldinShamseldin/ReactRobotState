import React, { useState } from 'react';

function Buttom_Connect() {
  // State for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Styles
  const buttonStyle = {
    margin: '5px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const inputStyle = {
    margin: '5px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  };

  // Function to handle SSH connection
  const handleSSHConnect = (command) => {
    fetch('http://localhost:3001/run-ssh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, command }),
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>CONNECTROBOT</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={() => handleSSHConnect('connect_ssh')} style={buttonStyle}>
        ROSBRIDGE ON
      </button>
      <button onClick={() => handleSSHConnect('disconnect_ssh')} style={buttonStyle}>
      ROSBRIDGE OFF
      </button>
      <button onClick={() => handleSSHConnect('connect_robot')} style={buttonStyle}>
        SENSORON
      </button>
      <button onClick={() => handleSSHConnect('disconnect_robot')} style={buttonStyle}>
        SENSOROFF
      </button>
    </div>
  );
}

export default Buttom_Connect;
