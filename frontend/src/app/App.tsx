import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import FarmsPage from "../features/farms/pages/FarmsPage";
import FarmDetailsPage from "../features/farms/pages/FarmDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exploracoes" element={<FarmsPage />} />
          <Route path="/exploracoes/:farmId" element={<FarmDetailsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}