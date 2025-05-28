# 🦥 Slauth Modal

Simple drop-in authentication modal for React apps that connects to a Slauth-Kit backend, supporting both email/password and OAuth flows.

---

## 📦 Installation

Install via npm:

```bash
npm install slauth-modal
```

---

## 🚀 Quick Start

```tsx
import React, { useState } from "react";
import { SlauthModal } from "slauth-modal";

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <div className="h-screen flex items-center justify-center">
      {!token ? (
        <SlauthModal
          baseUrl="https://your-slauth-api.com"
          onLoginSuccess={setToken}
        />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            🎉 Logged in!
          </h1>
          <p>Your JWT token:</p>
          <pre className="bg-gray-200 p-4 break-all">{token}</pre>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
              localStorage.removeItem('slauth_token');
              window.location.reload();
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
```

---

## 🔑 Props

| Prop             | Type                                                   | Description                                                                                                |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `baseUrl`        | `string`                                               | **Required.** The URL of your Slauth-Kit API (e.g. `https://api.example.com`).                             |
| `onLoginSuccess` | `(token: string) => void`                              | **Required.** Callback invoked with the JWT token after a successful login or OAuth flow.                  |
| `oauthProviders` | `OAuthProviderKey[]`                                   | Optional list of OAuth providers to show. Keys: `"google"`, `"github"`, `"discord"`, etc.                  |
| `useThemedIcons` | `boolean`                                              | Optional. When `true`, renders monochrome icons matching the theme; otherwise, uses default colored icons. |
| `theme`          | `{ background: string; text: string; accent: string }` | Optional custom theme colors (hex, RGB, etc.) for modal background, text, and accent.                      |

---

## 🔐 Email/Password Flow

By default, the modal shows **Log In** and **Sign Up** screens.
Enter your email and password to authenticate.

---

## 🌐 OAuth Flow

To enable OAuth buttons, pass the `oauthProviders` prop:

```tsx
<SlauthModal
  baseUrl="https://your-slauth-api.com"
  onLoginSuccess={setToken}
  oauthProviders={[
    'google', 'github', 'discord', 'microsoft', 'facebook',
    'twitter', 'apple', 'gitlab', 'linkedin', 'reddit',
    'amazon', 'twitch'
  ]}
  useThemedIcons={true}
/>
```

* If more than 4 providers are given, they render as smaller icon-only buttons in a centered grid.
* Clicking an OAuth button redirects to your backend’s `/api/auth/oauth/{provider}` endpoint.
* After successful OAuth, the backend redirects back to your frontend with `?token=<JWT>`.

---

## 🎨 Theming

Customize colors by passing a `theme` prop:

```tsx
<SlauthModal
  baseUrl="..."
  onLoginSuccess={...}
  theme={{
    background: '#F5F0E1',
    text: '#4A342E',
    accent: '#8DA87F'
  }}
/>
```

This overrides the default sloth-inspired brown/green palette.

---

## 🛠 Development

1. Clone the repo and install:

    ```bash
        git clone [https://github.com/lukejlackey/slauth-kit.git](https://github.com/lukejlackey/slauth-kit.git)
        cd slauth-kit/frontend/slauth-modal
        npm install
    ```

2. Run the playground/example app:
    ```bash
        npm run dev
        # open http://localhost:5173
    ```

3. Build the library:

    ```bash
        npm run build\:lib
    ```

---

## 📄 License

MIT © Luke Lackey
