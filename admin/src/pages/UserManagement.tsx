import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student' | 'faculty';
  status: 'active' | 'blocked' | 'pending';
  joinDate: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockData: User[] = [
        { id: '1', name: 'John Doe', email: 'john@university.edu', role: 'student', status: 'active', joinDate: '2024-01-15', lastLogin: '2024-03-20' },
        { id: '2', name: 'Jane Smith', email: 'jane@university.edu', role: 'faculty', status: 'active', joinDate: '2024-01-10', lastLogin: '2024-03-19' },
        { id: '3', name: 'Robert Johnson', email: 'robert@university.edu', role: 'staff', status: 'active', joinDate: '2024-02-01', lastLogin: '2024-03-18' },
        { id: '4', name: 'Admin User', email: 'admin@campuspark.com', role: 'admin', status: 'active', joinDate: '2024-01-01', lastLogin: '2024-03-20' },
        { id: '5', name: 'Michael Brown', email: 'michael@university.edu', role: 'student', status: 'blocked', joinDate: '2024-02-15', lastLogin: '2024-03-10' },
        { id: '6', name: 'Sarah Wilson', email: 'sarah@university.edu', role: 'faculty', status: 'active', joinDate: '2024-01-20', lastLogin: '2024-03-17' },
        { id: '7', name: 'David Lee', email: 'david@university.edu', role: 'student', status: 'pending', joinDate: '2024-03-01', lastLogin: '2024-03-01' },
        { id: '8', name: 'Lisa Taylor', email: 'lisa@university.edu', role: 'staff', status: 'active', joinDate: '2024-02-10', lastLogin: '2024-03-19' },
      ];
      setUsers(mockData);
      
      // Actual API call (uncomment when backend is ready):
      // const response = await api.getUsers();
      // if (response.success && response.data) {
      //   setUsers(response.data);
      // }
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
      // Mock API call
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role as User['role'],
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
      };
      
      setUsers([...users, newUser]);
      
      // Actual API call (uncomment when backend is ready):
      // const response = await api.addUser(formData);
      // if (response.success) {
      //   fetchUsers(); // Refresh list
      // }
      
      setShowForm(false);
      setFormData({ name: '', email: '', role: 'student', password: '' });
      alert('User added successfully! They will receive an activation email.');
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user');
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        // Actual API call (uncomment when backend is ready):
        // await api.blockUser(userId);
        
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: 'blocked' as const }
            : user
        ));
        alert('User blocked successfully');
      } catch (error) {
        console.error('Failed to block user:', error);
        alert('Failed to block user');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // In real app: api.deleteUser(userId)
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'staff': return '#f59e0b';
      case 'faculty': return '#3b82f6';
      case 'student': return '#10b981';
      default: return '#8892b0';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'blocked': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#8892b0';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>User Management</h1>
            <p style={{ color: '#8892b0', fontSize: '16px' }}>
              Manage user accounts, permissions, and access controls
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>+</span> Add New User
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(17, 34, 64, 0.5)',
                border: '1px solid rgba(100, 255, 218, 0.2)',
                borderRadius: '8px',
                color: '#e6f1ff',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select style={styles.select}>
              <option>All Roles</option>
              <option>Admin</option>
              <option>Staff</option>
              <option>Faculty</option>
              <option>Student</option>
            </select>
            <select style={styles.select}>
              <option>All Status</option>
              <option>Active</option>
              <option>Blocked</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#64ffda' }}>
            Add New User
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@university.edu"
                  style={styles.input}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={styles.label}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Set temporary password"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn btn-primary">
                Create User
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

      {/* Users Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ color: '#8892b0' }}>Loading users...</div>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${getRoleColor(user.role)}30, ${getRoleColor(user.role)}50)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: getRoleColor(user.role),
                          fontWeight: 'bold' as const,
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: '#e6f1ff', fontWeight: '500' as const }}>
                            {user.name}
                          </div>
                          <div style={{ color: '#8892b0', fontSize: '13px' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        background: getRoleColor(user.role) + '20',
                        border: `1px solid ${getRoleColor(user.role)}`,
                        borderRadius: '12px',
                        color: getRoleColor(user.role),
                        fontSize: '12px',
                        fontWeight: '600' as const,
                        textTransform: 'capitalize' as const,
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        background: getStatusColor(user.status) + '20',
                        border: `1px solid ${getStatusColor(user.status)}`,
                        borderRadius: '12px',
                        color: getStatusColor(user.status),
                        fontSize: '12px',
                        fontWeight: '600' as const,
                        textTransform: 'capitalize' as const,
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ color: '#8892b0' }}>{user.joinDate}</td>
                    <td style={{ color: '#8892b0' }}>{user.lastLogin}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => alert(`Edit ${user.name}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '12px',
                            borderColor: '#ef4444',
                            color: '#ef4444',
                          }}
                          onClick={() => handleBlockUser(user.id)}
                        >
                          {user.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '12px',
                            borderColor: '#ef4444',
                            color: '#ef4444',
                          }}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#8892b0' }}>
              No users found matching your search criteria.
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(100, 255, 218, 0.1)',
          }}>
            <div style={{ color: '#8892b0', fontSize: '14px' }}>
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                Previous
              </button>
              <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                Next
              </button>
            </div>
          </div>
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
  select: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(10, 25, 47, 0.5)',
    border: '1px solid rgba(100, 255, 218, 0.2)',
    borderRadius: '8px',
    color: '#e6f1ff',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default UserManagement;