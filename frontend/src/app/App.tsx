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
const InventoryPage = lazy(() => import("../features/inventory/pages/InventoryPage"));
const MachineryPage = lazy(() => import("../features/machinery/pages/MachineryPage"));
const FieldDiaryPage = lazy(() => import("../features/field-diary/pages/FieldDiaryPage"));
const HarvestPage = lazy(() => import("../features/harvest/pages/HarvestPage"));
const TraceabilityPage = lazy(() => import("../features/traceability/pages/TraceabilityPage"));
const ProductivityDashboardPage = lazy(() => import("../features/productivity/pages/ProductivityDashboardPage"));
const WeatherPage = lazy(() => import("../features/weather/pages/WeatherPage"));
const RecommendationsPage = lazy(() => import("../features/recommendations/pages/RecommendationsPage"));
const ProductionReadinessPage = lazy(() => import("../features/system/pages/ProductionReadinessPage"));
const SoilIntelligencePage = lazy(() => import("../features/soil/pages/SoilIntelligencePage"));
const OfficialFireRiskPage = lazy(() => import("../features/fire-official/pages/OfficialFireRiskPage"));
const IcnfCartographyPage = lazy(() => import("../features/icnf-map/pages/IcnfCartographyPage"));
const ComplianceCenterPage = lazy(() => import("../features/compliance/pages/ComplianceCenterPage"));
const ComplianceDocumentsPage = lazy(() => import("../features/compliance/pages/ComplianceDocumentsPage"));
const TreatmentsPage = lazy(() => import("../features/treatments/pages/TreatmentsPage"));
const WaterEnvironmentPage = lazy(() => import("../features/water-environment/pages/WaterEnvironmentPage"));
const IfapPepacPage = lazy(() => import("../features/ifap/pages/IfapPepacPage"));
const FiscalLabourPage = lazy(() => import("../features/fiscal-labour/pages/FiscalLabourPage"));
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
              <Route path="/inventario" element={<InventoryPage />} />
              <Route path="/maquinas" element={<MachineryPage />} />
              <Route path="/diario-talhao" element={<FieldDiaryPage />} />
              <Route path="/colheitas" element={<HarvestPage />} />
              <Route path="/rastreabilidade" element={<TraceabilityPage />} />
              <Route path="/produtividade" element={<ProductivityDashboardPage />} />
              <Route path="/clima" element={<WeatherPage />} />
              <Route path="/recomendacoes" element={<RecommendationsPage />} />
              <Route path="/configuracoes" element={<ProductionReadinessPage />} />
              <Route path="/solo-inteligente" element={<SoilIntelligencePage />} />
              <Route path="/risco-incendio-oficial" element={<OfficialFireRiskPage />} />
              <Route path="/cartografia-incendio" element={<IcnfCartographyPage />} />
              <Route path="/obrigacoes" element={<ComplianceCenterPage />} />
              <Route path="/documentos-conformidade" element={<ComplianceDocumentsPage />} />
              <Route path="/tratamentos-agricolas" element={<TreatmentsPage />} />
              <Route path="/agua-ambiente" element={<WaterEnvironmentPage />} />
              <Route path="/ifap-pepac" element={<IfapPepacPage />} />
              <Route path="/fiscal-laboral" element={<FiscalLabourPage />} />
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
