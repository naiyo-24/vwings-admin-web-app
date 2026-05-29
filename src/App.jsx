import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Login from './pages/Login';
import Layout from './components/Layout';
import './App.css';

// Import all module pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import Fees from './pages/Fees';
import Salaries from './pages/Salaries';
import Commissions from './pages/Commissions';
import Announcements from './pages/Announcements';
import Ads from './pages/Ads';
import Enquiries from './pages/Enquiries';
import Counsellors from './pages/Counsellors';
import Generation from './pages/Generation';
import Help from './pages/Help';
import Onboarding from './pages/Onboarding';
import AboutUs from './pages/AboutUs';
import Support from './pages/Support';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null); // stores { id, email }

  const handleLoaderComplete = () => setLoading(false);

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, message: err.detail || 'Invalid credentials' };
      }
    } catch {
      return { success: false, message: 'Cannot connect to server. Is the backend running?' };
    }
  };

  const handleLogout = () => setAdmin(null);

  if (loading) return <Loader onComplete={handleLoaderComplete} />;
  if (!admin) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout admin={admin} onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="courses" element={<Courses />} />
          <Route path="fees" element={<Fees />} />
          <Route path="salaries" element={<Salaries />} />
          <Route path="commissions" element={<Commissions />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="ads" element={<Ads />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="counsellors" element={<Counsellors />} />
          <Route path="generation" element={<Generation />} />
          <Route path="help" element={<Help />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
