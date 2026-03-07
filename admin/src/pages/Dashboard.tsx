import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { socket } from '../services/socket';
import ZoneOccupancyChart from "../components/ZoneOccupancyChart";
import AnimatedSlotGrid from '../components/AnimatedSlotGrid';

interface DashboardStats {
  totalUsers: number;
  totalParkingAreas: number;
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  todayEntries: number;
  todayExits: number;
  zoneOccupancy?: any[];
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

    const [stats, setStats] = useState<DashboardStats>({
      totalUsers: 0,
      totalParkingAreas: 0,
      totalSlots: 0,
      occupiedSlots: 0,
      availableSlots: 0,
      todayEntries: 0,
      todayExits: 0,
      zoneOccupancy: []
    });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();

    socket.on("slotUpdated", () => {
      fetchDashboardStats();
    });

    return () => {
      socket.off("slotUpdated");
    };
  }, []);


  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await api.getDashboardStats();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        console.error("Failed:", response.message);
      }

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, color: '#64ffda', icon: '👥' },
    { title: 'Parking Areas', value: stats.totalParkingAreas, color: '#57cbff', icon: '📍' },
    { title: 'Total Slots', value: stats.totalSlots, color: '#ff6b9d', icon: '🚗' },
    { title: 'Occupied', value: stats.occupiedSlots, color: '#ffd166', icon: '🟡' },
    { title: 'Available', value: stats.availableSlots, color: '#10b981', icon: '🟢' },
    { title: 'Today Entries', value: stats.todayEntries, color: '#9d4edd', icon: '📥' },
    { title: 'Today Exits', value: stats.todayExits, color: '#4ecdc4', icon: '📤' },
  ];


  return (
    <div className="container" style={{ padding: '20px' }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
      }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Dashboard</h1>
          <p style={{ color: '#8892b0', fontSize: '16px' }}>
            Welcome back, <span style={{ color: '#64ffda' }}>
              {user?.name || 'Admin'}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/admin" className="btn btn-secondary">
            Admin Panel
          </Link>
          <button className="btn btn-secondary" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div className="dashboard-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: '#8892b0',
                    marginBottom: '8px'
                  }}>
                    {stat.title}
                  </div>

                  <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: stat.color
                  }}>
                    {stat.value}
                  </div>
                </div>

                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ZoneOccupancyChart zones={stats.zoneOccupancy || []} />
      <AnimatedSlotGrid
        occupied={stats.occupiedSlots}
        total={stats.totalSlots}
      />
    </div>
  );
};

export default Dashboard;
