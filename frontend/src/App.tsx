import { BrowserRouter, Routes, Route } from 'react-router'
import AppLayout from '@/layouts/AppLayout'
import Dashboard from '@/pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/route-planner" element={<h1 className="text-2xl font-bold">Route Planner</h1>} />
          <Route path="/charging-stations" element={<h1 className="text-2xl font-bold">Charging Stations</h1>} />
          <Route path="/map" element={<h1 className="text-2xl font-bold">Explore Map</h1>} />
          <Route path="/settings" element={<h1 className="text-2xl font-bold">Settings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App