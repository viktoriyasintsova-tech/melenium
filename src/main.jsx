import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { prefetchHomeAssets } from "./routes/pageRoutes";

prefetchHomeAssets();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function hideSplash() {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  splash.classList.add("app-splash--hidden");
  window.setTimeout(() => splash.remove(), 600);
}

// Прячем экран загрузки после первой отрисовки приложения.
requestAnimationFrame(() => requestAnimationFrame(hideSplash));
