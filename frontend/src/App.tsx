import { Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PlaceholderPage from "@/pages/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PlaceholderPage title="Route Planner" />} />
        <Route path="/about" element={<PlaceholderPage title="About" />} />
      </Route>
    </Routes>
  );
}