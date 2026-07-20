import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import { Providers } from "./app/providers";
import PwaStatus from "./features/pwa/components/PwaStatus";
import { registerFarphaServiceWorker } from "./features/pwa/registerServiceWorker";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
      <PwaStatus />
    </Providers>
  </React.StrictMode>
);

registerFarphaServiceWorker();
