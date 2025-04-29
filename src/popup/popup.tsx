import { useState } from 'react';

interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function Popup() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = () => {
    setLoading(true);
    setError(null);

    chrome.runtime.sendMessage(
      { target: 'offscreen', type: 'firebase-auth' },
      (response) => {
        setLoading(false);

        if (!response || response.name === 'FirebaseError') {
          setError(response?.message || 'Authentication failed'); // Getting Error when sign in button clicked
          return;
        }

        // The Firebase user object
        setUser({
          uid: response.user.uid,
          displayName: response.user.displayName,
          email: response.user.email,
          photoURL: response.user.photoURL,
        });
      }
    );
  };

  return (
    <div style={{ padding: 16, width: 250 }}>
      <h2>My Extension</h2>

      {loading && <p>Signing in...</p>}

      {user ? (
        <div>
          <p>Welcome, {user.displayName || user.email}!</p>
          {user.photoURL && <img src={user.photoURL} width={40} />}
        </div>
      ) : (
        <button onClick={handleSignIn} disabled={loading}>
          Sign in with Google
        </button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
