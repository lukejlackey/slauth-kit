import React, { useState } from "react";
import { SlauthModal } from "../src/components/SlauthModal";

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!token ? (
        <SlauthModal baseUrl="http://localhost:8080"
          onLoginSuccess={setToken}
          oauthProviders={[
            "google",
            "github",
            "discord",
            "microsoft",
            "facebook",
            "twitter",
            "apple",
            "gitlab",
            "linkedin",
            "reddit",
            "amazon",
            "twitch",
          ]}
          useThemedIcons={true}
        />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Logged in!</h1>
          <p>JWT Token:</p>
          <pre className="bg-gray-200 p-2">{token}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
