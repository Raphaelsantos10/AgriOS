import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppErrorBoundary from "../components/errors/AppErrorBoundary";
import PageLoader from "../components/ui/PageLoader";
import Layout from "./layout";

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
const NotFoundPage = lazy(
  () => import("../features/system/pages/NotFoundPage"),
);

export default function App() {
  return (
    <AppErrorBoundary>
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
