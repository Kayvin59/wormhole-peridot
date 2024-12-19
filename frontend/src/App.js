import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinnerPage from "./components/common/loading/LoadingSpinnerPage.js";

const LandingContainer = lazy(
  () => import("./components/content/landing/LandingContainer.js"),
);
const BridgeContainer = lazy(
  () => import("./components/content/bridge/BridgeContainer.js"),
);
const PeridotSwapContainer = lazy(
  () => import("./components/content/peridotSwap/PeridotSwapContainer.js"),
);
const IFOContainer = lazy(
  () => import("./components/content/ifo/IFOContainer.js"),
);
const InventoryContainer = lazy(
  () => import("./components/content/inventory/InventoryContainer.js"),
);
const NotFoundContainer = lazy(
  () => import("./components/content/notFound/NotFoundContainer.js"),
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinnerPage />}>
        <Routes>
          <Route exact path="/" element={<LandingContainer />} />

          <Route exact path="/bridge" element={<BridgeContainer />} />
          <Route
            exact
            path="/peridot-swap"
            element={<PeridotSwapContainer />}
          />
          <Route exact path="/ifo" element={<IFOContainer />} />
          <Route exact path="/inventory" element={<InventoryContainer />} />

          <Route path="*" element={<NotFoundContainer />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
