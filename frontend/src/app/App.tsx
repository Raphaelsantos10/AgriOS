import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import PageLoader from "../components/ui/PageLoader";

const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const FarmsPage = lazy(() => import("../features/farms/pages/FarmsPage"));
const FarmDetailsPage = lazy(
  () => import("../features/farms/pages/FarmDetailsPage"),
);
const MissionsPage = lazy(
  () => import("../features/missions/pages/MissionsPage"),
);
const AgriculturalCalendarPage = lazy(
  () => import("../features/calendar/pages/AgriculturalCalendarPage"),
);
const AnalyticsPage = lazy(
  () => import("../features/analytics/pages/AnalyticsPage"),
);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exploracoes" element={<FarmsPage />} />
            <Route path="/exploracoes/:farmId" element={<FarmDetailsPage />} />
            <Route path="/missoes" element={<MissionsPage />} />
            <Route
              path="/calendario"
              element={<AgriculturalCalendarPage />}
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
