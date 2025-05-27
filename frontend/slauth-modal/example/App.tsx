import React, { useEffect, useState } from "react";
import { SlauthModal } from "../src";

function App() {
  // 1) Look for token in URL once
  const urlToken = new URLSearchParams(window.location.search).get("token");
  // 2) If present, stash it and clean up the URL
  useEffect(() => {
    if (urlToken) {
      localStorage.setItem("slauth_token", urlToken);
      window.history.replaceState({}, "", window.location.pathname);
      setToken(urlToken);
    }
  }, [urlToken]);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("slauth_token")
  );

  const logout = () => {
    localStorage.removeItem("slauth_token");
    setToken(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {!token ? (
        <SlauthModal
          baseUrl="http://localhost:8080"
          onLoginSuccess={(t) => {
            // if you never hit OAuth, this handles normal form
            localStorage.setItem("slauth_token", t);
            setToken(t);
          }}
          oauthProviders={[
            "google","github","discord","microsoft",
            "facebook","twitter","apple","gitlab",
            "linkedin","reddit","amazon","twitch",
          ]}
          useThemedIcons={true}
        />
      ) : (
        <div className="max-w-2xl w-3/5 bg-white p-6 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Logged in!</h1>
          <p className="mb-4 break-words">{token}</p>
          <button
            onClick={logout}
            className="bg-sloth-green text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
