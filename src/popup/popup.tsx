import { useState, useEffect } from 'react';
import './popup.css';

const Popup = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load the token when the popup is opened
  useEffect(() => {
    chrome.storage.local.get('access_token', (result) => {
      if (result.access_token) {
        setToken(result.access_token);  // Token exists, user is logged in
      } else {
        setToken(null);  // No token, user is not logged in
      }
    });
  }, []);

  const handleLogin = () => {
    chrome.runtime.sendMessage({ type: 'login' }, (response) => {
      if (response?.token) {
        setToken(response.token);
        setError(null);

        // Save the token in chrome.storage for future use
        chrome.storage.local.set({ access_token: response.token });

        console.log("Access token:", response.token);
      } else {
        setToken(null);
        setError(response?.error || "Unknown error");
        console.error("Login failed:", response?.error);
      }
    });
  };

  const handleLogout = () => {
    setToken(null);
    setError(null);

    // Remove token from chrome.storage
    chrome.storage.local.remove('access_token', () => {
      console.log("Logged out and token removed.");
    });
  };

  return (
    <div>
      <h1>Youtube Extension</h1>

      {token ? (
        <div>
          <p>Logged in</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Popup;
