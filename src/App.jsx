import { Suspense } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import CartDrawer from "./components/cart/CartDrawer";
import PageTransition from "./components/layout/PageTransition";
import PageFallback from "./components/layout/PageFallback";
import Home from "./pages/Home";
import { useDisplayedLocation } from "./hooks/useDisplayedLocation";
import { useHeaderVariant } from "./hooks/useHeaderVariant";
import { useRoutePrefetch } from "./hooks/useRoutePrefetch";
import {
  CatalogPage,
  CheckoutPageRoute,
  FavoritesPageRoute,
  NotFoundRoute,
  ProductPageRoute,
} from "./routes/pageRoutes";

function LazyRoute({ children }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

function AppContent() {
  const { displayLocation, displayPathname, pendingPathname, transitionKey, useViewTransition } =
    useDisplayedLocation();
  const headerVariant = useHeaderVariant(displayPathname, pendingPathname);
  useRoutePrefetch();

  return (
    <>
      <Header variant={headerVariant} />
      <CartDrawer />
      <PageTransition
        displayLocation={displayLocation}
        transitionKey={transitionKey}
        useViewTransition={useViewTransition}
      >
        <Route path="/" element={<Home />} />
        <Route
          path="/catalog"
          element={
            <LazyRoute>
              <CatalogPage />
            </LazyRoute>
          }
        />
        <Route
          path="/catalog/:slug"
          element={
            <LazyRoute>
              <ProductPageRoute />
            </LazyRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <LazyRoute>
              <FavoritesPageRoute />
            </LazyRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <LazyRoute>
              <CheckoutPageRoute />
            </LazyRoute>
          }
        />
        <Route
          path="*"
          element={
            <LazyRoute>
              <NotFoundRoute />
            </LazyRoute>
          }
        />
      </PageTransition>
    </>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  );
}
