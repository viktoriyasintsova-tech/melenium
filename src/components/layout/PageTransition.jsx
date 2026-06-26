import { Routes } from "react-router-dom";

export default function PageTransition({
  children,
  displayLocation,
  transitionKey,
  useViewTransition,
}) {
  return (
    <div
      key={transitionKey}
      className={`page-view-transition${useViewTransition ? "" : " page-view-transition--fallback"}`}
    >
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}
