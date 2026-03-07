import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@campuspark.com',
    phone: user?.phone || '+1 (555) 123-4567',
    department: user?.department || 'Parking Management',
    role: user?.role || 'System Administrator',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // In real app: api.updateProfile(formData)
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Admin Profile</h1>
        <p style={{ color: '#8892b0', fontSize: '16px' }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' as const }}>
        {/* Profile Card */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #64ffda, #57cbff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#0a192f',
              marginRight: '20px',
            }}>
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>{formData.name}</h2>
              <p style={{ color: '#8892b0' }}>{formData.role}</p>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#64ffda' }}>
              Account Information
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label style={styles.label}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    <div style={styles.value}>{value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn btn-secondary" onClick={() => logout()}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* System Preferences */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#64ffda' }}>
            System Preferences
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              { label: 'Email Notifications', value: true, type: 'toggle' },
              { label: 'SMS Alerts', value: false, type: 'toggle' },
              { label: 'Default Dashboard View', value: 'Compact', type: 'select' },
              { label: 'Time Zone', value: 'IST (UTC+5:30)', type: 'select' },
              { label: 'Language', value: 'English', type: 'select' },
            ].map((pref) => (
              <div key={pref.label} style={styles.preference}>
                <span style={styles.preferenceLabel}>{pref.label}</span>
                {pref.type === 'toggle' ? (
                  <div style={styles.toggle}>
                    <div style={{
                      width: '40px',
                      height: '20px',
                      background: pref.value ? '#64ffda' : '#8892b0',
                      borderRadius: '10px',
                      position: 'relative' as const,
                      cursor: 'pointer',
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        background: '#0a192f',
                        borderRadius: '50%',
                        position: 'absolute' as const,
                        top: '2px',
                        left: pref.value ? '22px' : '2px',
                        transition: 'left 0.3s',
                      }} />
                    </div>
                  </div>
                ) : (
                  <span style={styles.preferenceValue}>{pref.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ marginTop: '40px', borderColor: '#ef4444' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#ef4444' }}>
          Danger Zone
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button style={styles.dangerButton}>
            Reset Password
          </button>
          <button style={styles.dangerButton}>
            Delete Account
          </button>
          <button style={styles.dangerButton} onClick={() => logout()}>
            Logout from All Devices
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#8892b0',
    marginBottom: '5px',
    fontWeight: '500' as const,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(10, 25, 47, 0.5)',
    border: '1px solid rgba(100, 255, 218, 0.2)',
    borderRadius: '6px',
    color: '#e6f1ff',
    fontSize: '14px',
  },
  value: {
    padding: '10px 12px',
    background: 'rgba(10, 25, 47, 0.3)',
    border: '1px solid rgba(100, 255, 218, 0.1)',
    borderRadius: '6px',
    color: '#e6f1ff',
    fontSize: '14px',
  },
  preference: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
  },
  preferenceLabel: {
    color: '#e6f1ff',
    fontSize: '14px',
  },
  preferenceValue: {
    color: '#8892b0',
    fontSize: '14px',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
  },
  dangerButton: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
};

export default AdminProfile;