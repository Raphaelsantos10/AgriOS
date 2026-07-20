import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppErrorBoundary from "../components/errors/AppErrorBoundary";
import PageLoader from "../components/ui/PageLoader";
import Layout from "./layout";

const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const OperationsCenterPage = lazy(() => import("../features/operations/pages/OperationsCenterPage"));
const FarmsPage = lazy(() => import("../features/farms/pages/FarmsPage"));
const FarmDetailsPage = lazy(
  () => import("../features/farms/pages/FarmDetailsPage"),
);
const MissionsPage = lazy(
  () => import("../features/missions/pages/MissionsPage"),
);
const WorkOrdersPage = lazy(
  () => import("../features/work-orders/pages/WorkOrdersPage"),
);
const AgriculturalCostsPage = lazy(() => import("../features/costs/pages/AgriculturalCostsPage"));
const FinancialReportPage = lazy(() => import("../features/costs/pages/FinancialReportPage"));
const AgriculturalCalendarPage = lazy(
  () => import("../features/calendar/pages/AgriculturalCalendarPage"),
);
const AnalyticsPage = lazy(
  () => import("../features/analytics/pages/AnalyticsPage"),
);
const CropLibraryPage = lazy(
  () => import("../features/crops/pages/CropLibraryPage"),
);
const FieldEnvironmentPage = lazy(
  () => import("../features/environment/pages/FieldEnvironmentPage"),
);
const CropSuitabilityPage = lazy(
  () => import("../features/suitability/pages/CropSuitabilityPage"),
);
const IrrigationPage = lazy(
  () => import("../features/irrigation/pages/IrrigationPage"),
);
const FieldFireIntelligencePage = lazy(
  () => import("../features/fire/pages/FieldFireIntelligencePage"),
);
const DiagnosticsPage = lazy(
  () => import("../features/diagnostics/pages/DiagnosticsPage"),
);
const DigitalTwinPage = lazy(
  () => import("../features/digital-twin/pages/DigitalTwinPage"),
);
const PrecisionAgriculturePage = lazy(
  () => import("../features/precision-agriculture/pages/PrecisionAgriculturePage"),
);
const IntelligencePage = lazy(
  () => import("../features/intelligence/pages/IntelligencePage"),
);
const AutomationCenterPage = lazy(() => import("../features/automation/pages/AutomationCenterPage"));
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
              <Route path="/centro-operacoes" element={<OperationsCenterPage />} />
              <Route path="/exploracoes" element={<FarmsPage />} />
              <Route path="/exploracoes/:farmId" element={<FarmDetailsPage />} />
              <Route path="/missoes" element={<MissionsPage />} />
              <Route path="/ordens" element={<WorkOrdersPage />} />
              <Route path="/custos" element={<AgriculturalCostsPage />} />
              <Route path="/financeiro" element={<FinancialReportPage />} />
              <Route
                path="/calendario"
                element={<AgriculturalCalendarPage />}
              />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/culturas" element={<CropLibraryPage />} />
              <Route
                path="/exploracoes/:farmId/talhoes/:fieldId/ambiente"
                element={<FieldEnvironmentPage />}
              />
              <Route
                path="/exploracoes/:farmId/talhoes/:fieldId/aptidao"
                element={<CropSuitabilityPage />}
              />
              <Route
                path="/exploracoes/:farmId/talhoes/:fieldId/irrigacao"
                element={<IrrigationPage />}
              />
              <Route
                path="/exploracoes/:farmId/talhoes/:fieldId/incendio"
                element={<FieldFireIntelligencePage />}
              />
              <Route path="/diagnostico" element={<DiagnosticsPage />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/precisao" element={<PrecisionAgriculturePage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="/automacoes" element={<AutomationCenterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
