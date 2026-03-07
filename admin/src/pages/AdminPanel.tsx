import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();

  const adminOptions = [
    { 
      title: 'Parking Areas', 
      description: 'Add, view and manage parking areas',
      path: '/admin/parking',
      icon: '📍',
      color: '#64ffda'
    },
    { 
      title: 'User Management', 
      description: 'Add, remove or block users',
      path: '/admin/users', 
      icon: '👥',
      color: '#57cbff'
    },
     { 
      title: 'Slot Optimizer Model', 
      description: 'Generate optimal parking layout using intelligent algorithm',
      path: '/admin/models/slot-optimizer',
      icon: '🧠',
      color: '#ff6b6b'
    },
    { 
      title: 'Slot Division Generator', 
      description: 'Divide parking area based on ratio of 2W and 4W',
      path: '/admin/models/slot-division',
      icon: '📐',
      color: '#ffd166'
    },
    { 
      title: 'Rebalance Model', 
      description: 'Optimize vehicle distribution across zones',
      path: '/admin/models/rebalance',
      icon: '🔄',
      color: '#9d4edd'
    },
    { 
      title: 'Reports & Analytics', 
      description: 'View detailed reports and analytics',
      path: '/dashboard', 
      icon: '📊',
      color: '#ffd166'
    },
    { 
      title: 'Admin Profile', 
      description: 'Manage your account settings',
      path: '/admin/profile', 
      icon: '👤',
      color: '#4ecdc4'
    },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Admin Control Panel</h1>
        <p style={{ color: '#8892b0', fontSize: '18px' }}>
          Welcome back, <span style={{ color: '#64ffda' }}>{user?.name || 'Admin'}</span>
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '24px',
        marginTop: '30px'
      }}>
        {adminOptions.map((option, index) => (
          <Link 
            key={index}
            to={option.path}
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div className="card" style={{ height: '100%' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${option.color}20, ${option.color}40)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  fontSize: '28px'
                }}>
                  {option.icon}
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    marginBottom: '5px',
                    color: option.color
                  }}>
                    {option.title}
                  </h3>
                  <p style={{ 
                    color: '#8892b0',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {option.description}
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                  Access →
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;