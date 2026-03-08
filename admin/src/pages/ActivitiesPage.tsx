import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
  _id: string;
  user: string;
  action: string;
  zone: string;
  type: string;
  createdAt: string;
}

const ActivitiesPage: React.FC = () => {
  const { user } = useAuth();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);

    useEffect(() => {
    fetchActivities();
  }, [typeFilter, search, page]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/activities`, {
        params: {
          type: typeFilter,
          search,
          page,
          limit: 10
        }
      });

      setActivities(res.data.activities);
      setTotalPages(res.data.totalPages);
      setTotalActivities(res.data.total);

    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'entry': return '📥';
      case 'exit': return '📤';
      case 'alert': return '⚠️';
      case 'user': return '👤';
      case 'slot': return '🚗';
      case 'update': return '🔄';
      case 'system': return '⚙️';
      case 'security': return '🔒';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'entry': return '#10b981';
      case 'exit': return '#3b82f6';
      case 'alert': return '#ef4444';
      case 'user': return '#9d4edd';
      case 'slot': return '#f59e0b';
      case 'update': return '#4ecdc4';
      case 'system': return '#8892b0';
      case 'security': return '#ff6b9d';
      default: return '#8892b0';
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>All Activities</h1>
            <p style={{ color: '#8892b0', fontSize: '16px' }}>
              Complete log of all system activities
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button onClick={() => setTypeFilter("all")} className="btn btn-primary">All</button>
          <button onClick={() => setTypeFilter("entry")} className="btn btn-secondary">Entries</button>
          <button onClick={() => setTypeFilter("exit")} className="btn btn-secondary">Exits</button>
          <button onClick={() => setTypeFilter("alert")} className="btn btn-secondary">Alerts</button>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'rgba(17, 34, 64, 0.5)',
                border: '1px solid rgba(100, 255, 218, 0.2)',
                borderRadius: '8px',
                color: '#e6f1ff',
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>User</th>
                  <th>Zone</th>
                  <th>Type</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: `${getActivityColor(activity.type)}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          color: getActivityColor(activity.type),
                        }}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div style={{ color: '#e6f1ff', fontWeight: 500 }}>
                          {activity.action}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#e6f1ff' }}>{activity.user}</td>
                    <td style={{ color: '#64ffda' }}>{activity.zone}</td>
                    <td style={{ color: getActivityColor(activity.type), textTransform: 'capitalize' }}>
                      {activity.type}
                    </td>
                    <td style={{ color: '#8892b0' }}>
                      {new Date(activity.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(100, 255, 218, 0.1)',
        }}>
          <div style={{ color: '#8892b0' }}>
            Showing {activities.length} of {totalActivities}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="btn btn-secondary"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;