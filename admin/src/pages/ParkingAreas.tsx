import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface ParkingArea {
  _id: string;
  name: string;
  location?: string;
  totalWidth?: number;
  totalLength?: number;
  slots: any[];
  isActive: boolean;
  // Computed for UI
  totalSlots?: number;
  availableSlots?: number;
  status?: string;
}

const ParkingAreas: React.FC = () => {
  const [areas, setAreas] = useState<ParkingArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<ParkingArea | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalWidth: '50',
    totalLength: '50',
    ratio2W: '0.6',
  });

  useEffect(() => {
    fetchParkingAreas();
  }, []);

  const fetchParkingAreas = async () => {
    try {
      const response = await api.getParkingAreas();
      if (response.success && response.data) {
        const mapped = response.data.map((a: any) => ({
          ...a,
          totalSlots: a.slots?.length || 0,
          availableSlots: 0,
          status: a.isActive ? 'active' : 'maintenance'
        }));
        setAreas(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch parking areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        location: formData.location,
        totalWidth: parseInt(formData.totalWidth),
        totalLength: parseInt(formData.totalLength),
        ratio2W: parseFloat(formData.ratio2W)
      };

      let response;

      if (editingArea) {
        response = await api.updateParkingArea(editingArea._id, payload);
      } else {
        response = await api.createParkingArea(payload);
      }

      if (response.success) {
        alert(editingArea ? "Area Updated!" : "Area Created!");
        setShowForm(false);
        setEditingArea(null);
        fetchParkingAreas();
      } else {
        alert(response.message);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;

    try {
      const response = await api.deleteParkingArea(id);
      if (response.success) {
        alert("Area deleted successfully");
        fetchParkingAreas();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };
  const handleEdit = (area: ParkingArea) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      location: area.location || '',
      totalWidth: String(area.totalWidth || 50),
      totalLength: String(area.totalLength || 50),
      ratio2W: '0.6'
    });
    setShowForm(true);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'full': return '#ef4444';
      default: return '#8892b0';
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Parking Areas</h1>
          <p style={{ color: '#8892b0', fontSize: '16px' }}>
            Manage parking zones and dynamic slot layouts
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>+</span> Create New Area
        </button>
      </div>

      {/* Add Parking Area Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#64ffda' }}>
            Create Dynamic Parking Area
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>Area Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., North Gate Zone"
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>Width (meters)</label>
                <input type="number" name="totalWidth" value={formData.totalWidth} onChange={handleInputChange} style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Length (meters)</label>
                <input type="number" name="totalLength" value={formData.totalLength} onChange={handleInputChange} style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>2-Wheeler Ratio (0.0 - 1.0)</label>
                <input type="number" name="ratio2W" step="0.1" min="0" max="1" value={formData.ratio2W} onChange={handleInputChange} style={styles.input} required />
                <small style={{ color: '#8892b0' }}>Example: 0.7 = 70% Bikes</small>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn btn-primary">
                Generate Layout & Create
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parking Areas Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ color: '#8892b0' }}>Loading parking areas...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {areas.map((area) => (
            <div key={area._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '5px', color: '#e6f1ff' }}>
                    {area.name}
                  </h3>
                  <div style={{ color: '#8892b0', fontSize: '12px' }}>
                    {area.totalWidth}m x {area.totalLength}m
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: getStatusColor(area.status || 'active') + '20',
                  border: `1px solid ${getStatusColor(area.status || 'active')}`,
                  borderRadius: '20px',
                  color: getStatusColor(area.status || 'active'),
                  fontSize: '12px',
                  fontWeight: '600' as const,
                }}>
                  {area.status || 'Active'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#8892b0', fontSize: '14px' }}>Total Slots Created</span>
                  <span style={{ color: '#e6f1ff', fontSize: '14px' }}>
                    {area.totalSlots}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(area)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(area._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#8892b0',
    marginBottom: '8px',
    fontWeight: '500' as const,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(10, 25, 47, 0.5)',
    border: '1px solid rgba(100, 255, 218, 0.2)',
    borderRadius: '8px',
    color: '#e6f1ff',
    fontSize: '14px',
  },
  statCard: {
    background: 'rgba(10, 25, 47, 0.3)',
    border: '1px solid rgba(100, 255, 218, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center' as const,
  },
};

export default ParkingAreas;