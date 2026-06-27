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

const SPLASH_START = performance.now();
const SPLASH_MIN_MS = 500;

function hideSplash() {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  splash.classList.add("app-splash--hidden");
  window.setTimeout(() => splash.remove(), 600);
}

// Прячем экран загрузки после первой отрисовки приложения,
// но не раньше минимального времени показа, чтобы анимация была заметной.
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    const elapsed = performance.now() - SPLASH_START;
    const wait = Math.max(0, SPLASH_MIN_MS - elapsed);
    window.setTimeout(hideSplash, wait);
  }),
);
