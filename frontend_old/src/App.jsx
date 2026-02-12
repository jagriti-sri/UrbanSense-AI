import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Flood from "./pages/Flood";
import AQI from "./pages/AQI";
import Waste from "./pages/Waste";
import Weather from "./pages/Weather";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";

import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flood" element={<Flood />} />
          <Route path="/aqi" element={<AQI />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

      </div>
    </div>
  );
}

export default App;
