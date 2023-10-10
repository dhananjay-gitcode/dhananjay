import React, { useState } from 'react';
import './App.css';

export function App() {
  const [storeName, setStoreName] = useState('');
  const [installUrl, setInstallUrl] = useState('');

  const handleInstall = async () => {
    if (storeName) {
      try {
        const response = await fetch('/install', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ storeName }),
        });

        if (response.ok) {
          const data = await response.json();
          setInstallUrl(data.installUrl);
        } else {
          console.error('Failed to fetch install URL');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Shopify App Installer</h1>
      <label>
        Enter Store Name: 
        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
      </label>
      <button onClick={handleInstall}>Install App</button>

      {installUrl && (
        <div>
          <p>Click the link below to install the app:</p>
          <a href={installUrl} target="_blank" rel="noopener noreferrer">{installUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;
