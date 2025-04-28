# Slauth Modal

Simple drop-in authentication modal for React apps that connects to a Slauth-Kit backend.

## Usage

```tsx
import { SlauthModal } from "./path/to/slauth-modal";

<SlauthModal baseUrl="https://your-slauth-api.com" onLoginSuccess={(token) => console.log(token)} />
```