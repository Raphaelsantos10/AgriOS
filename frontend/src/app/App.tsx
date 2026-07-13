import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import FarmsPage from "../features/farms/pages/FarmsPage";
import FarmDetailsPage from "../features/farms/pages/FarmDetailsPage";
import MissionsPage from "../features/missions/pages/MissionsPage";
import AgriculturalCalendarPage from "../features/calendar/pages/AgriculturalCalendarPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exploracoes" element={<FarmsPage />} />
          <Route path="/exploracoes/:farmId" element={<FarmDetailsPage />} />
          <Route path="/missoes" element={<MissionsPage />} />
          <Route path="/calendario" element={<AgriculturalCalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}