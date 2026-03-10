import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InventoryGrid from './pages/InventoryGrid';
import Analytics from './pages/Analytics';
import Hotels from './pages/Hotels';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import Channels from './pages/Channels';
import Settings from './pages/Settings';
import Login from './pages/Login';
import PublicHotelSearch from './pages/PublicHotelSearch';

function App() {
  const [selectedHotelId, setSelectedHotelId] = useState(() => localStorage.getItem('selectedHotelId'));
  const [hotels, setHotels] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('g2h_user');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hotels`);
        const data = await response.json();
        setHotels(data);
        if (data.length > 0 && !selectedHotelId) {
          setSelectedHotelId(data[0].id);
          localStorage.setItem('selectedHotelId', data[0].id);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  const handleHotelChange = (id) => {
    setSelectedHotelId(id);
    localStorage.setItem('selectedHotelId', id);
  };
  const handleLogout = () => {
    localStorage.removeItem('g2h_token');
    localStorage.removeItem('g2h_user');
    setUser(null);
  };

  const AdminRoutes = () => {
    if (!user) return <Login onLogin={setUser} />;
    return (
      <Layout
        hotels={hotels}
        selectedHotelId={selectedHotelId}
        onHotelChange={handleHotelChange}
        user={user}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<InventoryGrid selectedHotelId={selectedHotelId} />} />
          <Route path="/dashboard" element={<Dashboard selectedHotelId={selectedHotelId} />} />
          <Route path="/analytics" element={<Analytics selectedHotelId={selectedHotelId} />} />
          <Route path="/hotels" element={<Hotels selectedHotelId={selectedHotelId} onHotelChange={handleHotelChange} />} />
          <Route path="/rooms" element={<Rooms selectedHotelId={selectedHotelId} />} />
          <Route path="/bookings" element={<Bookings selectedHotelId={selectedHotelId} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/channels" element={<Channels selectedHotelId={selectedHotelId} />} />
          <Route path="/settings" element={<Settings selectedHotelId={selectedHotelId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/search" element={<PublicHotelSearch />} />
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
