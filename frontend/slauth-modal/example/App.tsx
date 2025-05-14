import React, { useState, useEffect } from "react";
import { SlauthModal } from "../src";

function App() {
  // Check localStorage first
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("slauth_token");
    if (saved) setToken(saved);
  }, []);

  const handleLoginSuccess = (tok: string) => {
    localStorage.setItem("slauth_token", tok);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem("slauth_token");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!token ? (
        <SlauthModal
          baseUrl="http://localhost:8080"
          onLoginSuccess={handleLoginSuccess}
          oauthProviders={[
            "google", "github", "discord", "microsoft",
            "facebook", "twitter", "apple", "gitlab",
            "linkedin", "reddit", "amazon", "twitch",
          ]}
          useThemedIcons={true}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-3/5 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Logged in!</h1>
          <p className="mb-2">JWT Token:</p>
          <pre className="bg-gray-200 p-4 break-words text-left rounded">{token}</pre>
          <button
            onClick={handleLogout}
            className="mt-6 bg-sloth-green hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition-all"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;