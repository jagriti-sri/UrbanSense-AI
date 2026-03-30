import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AirPage from './pages/AirPage';
import RainfallPage from './pages/RainfallPage';
import WastePage from './pages/WastePage';
import LandPage from './pages/LandPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import FloodRiskPage from "./pages/FloodRiskPage";


import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/air" element={<AirPage />} />
        <Route path="/flood" element={<FloodRiskPage />} />
        <Route path="/rainfall" element={<RainfallPage />} />
        <Route path="/waste" element={<WastePage />} />
        <Route path="/land" element={<LandPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
