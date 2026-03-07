import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const LoginPage: React.FC = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!regNo || !password) {
      setError('Please enter both Registration Number and password');
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { regNo, password });
      const response = await login(regNo, password);
      console.log("Login Response from Context:", response);

      if (response && response.success) {
        navigate('/dashboard');
      } else {
        const msg = response?.message || 'Invalid credentials';
        console.error("Login failed with message:", msg);
        setError(`Login failed: ${msg}`);
      }
    } catch (err) {
      console.error("Login Error Object:", err);
      setError('Login failed. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚗</span>
            <span style={styles.logoText}>CampusPark</span>
          </div>
          <h2 style={styles.title}>Admin Login</h2>
          <p style={styles.subtitle}>Access the parking management system</p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Registration Number / Admin ID</label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              style={styles.input}
              placeholder="ADMIN001"
              disabled={loading}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="admin123"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.buttonLoading : styles.button}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div style={styles.demo}>
          <p style={styles.demoTitle}>Demo Credentials:</p>
          <p style={styles.demoText}><strong>ID:</strong> ADMIN001</p>
          <p style={styles.demoText}><strong>Password:</strong> admin123</p>
        </div>

        <div style={styles.back}>
          <button
            onClick={() => navigate('/')}
            style={styles.backButton}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'rgba(17, 34, 64, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 255, 218, 0.1)',
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  logoIcon: {
    fontSize: '32px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    background: 'linear-gradient(135deg, #64ffda, #57cbff)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#e6f1ff',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#8892b0',
    margin: 0,
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  form: {
    marginBottom: '32px',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#8892b0',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(10, 25, 47, 0.5)',
    border: '1px solid rgba(100, 255, 218, 0.2)',
    borderRadius: '8px',
    color: '#e6f1ff',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #64ffda, #57cbff)',
    color: '#0a192f',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonLoading: {
    width: '100%',
    padding: '16px',
    background: 'rgba(100, 255, 218, 0.5)',
    color: '#0a192f',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'not-allowed',
  },
  demo: {
    backgroundColor: 'rgba(100, 255, 218, 0.05)',
    border: '1px solid rgba(100, 255, 218, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  demoTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#64ffda',
    margin: '0 0 12px 0',
  },
  demoText: {
    fontSize: '13px',
    color: '#8892b0',
    margin: '6px 0',
  },
  back: {
    textAlign: 'center' as const,
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#8892b0',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 16px',
    transition: 'color 0.3s ease',
  },
};

export default LoginPage;