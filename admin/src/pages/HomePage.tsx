import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div className="container" style={styles.navContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚗</span>
            <span style={styles.logoText}>CampusPark</span>
          </div>
          <div style={styles.navLinks}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={styles.navLink}>
                Dashboard
              </Link>
            ) : (
              <Link to="/login" style={styles.navLink}>
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Campus Park
            <span style={styles.heroSubtitle}>Smart Parking Assistant</span>
          </h1>
          <p style={styles.heroDescription}>
            Intelligent parking management system for educational campuses.
            Streamline parking operations, reduce congestion, and enhance campus experience.
          </p>
          <div style={styles.heroButtons}>
            {isAuthenticated ? (
              <Link to="/admin" className="btn btn-primary" style={styles.heroButton}>
                Go to Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary" style={styles.heroButton}>
                  Admin Login
                </Link>
                <Link to="/dashboard" className="btn btn-secondary" style={styles.heroButton}>
                  View Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why Choose Campus Park?</h2>
          <div style={styles.featuresGrid}>
            {[
              { icon: '📊', title: 'Real-time Analytics', desc: 'Live monitoring of parking occupancy and trends' },
              { icon: '🔐', title: 'Secure Access', desc: 'Role-based authentication and authorization system' },
              { icon: '📱', title: 'QR Integration', desc: 'Scan parking tickets using device camera' },
              { icon: '👥', title: 'User Management', desc: 'Complete control over user permissions and access' },
              { icon: '📍', title: 'Zone Management', desc: 'Create and manage multiple parking areas' },
              { icon: '📈', title: 'Reporting', desc: 'Detailed reports and analytics dashboard' },
            ].map((feature, index) => (
              <div key={index} className="card" style={styles.featureCard}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.logoIcon}>🚗</span>
            <span style={styles.logoText}>CampusPark</span>
          </div>
          <p style={styles.footerText}>
            Smart Parking Management System © {new Date().getFullYear()}
          </p>
          <div style={styles.footerLinks}>
            <Link to="/login" style={styles.footerLink}>Admin Login</Link>
            <span style={styles.footerDivider}>•</span>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <span style={styles.footerDivider}>•</span>
            <a href="#" style={styles.footerLink}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a192f',
  },
  navbar: {
    backgroundColor: 'rgba(10, 25, 47, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '20px 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    background: 'linear-gradient(135deg, #64ffda, #57cbff)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
  },
  navLink: {
    color: '#e6f1ff',
    textDecoration: 'none',
    fontWeight: '500' as const,
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(100, 255, 218, 0.2)',
  },
  hero: {
    padding: '100px 0',
    background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  heroContent: {
    textAlign: 'center' as const,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #64ffda, #57cbff)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  },
  heroSubtitle: {
    display: 'block' as const,
    fontSize: '28px',
    color: '#8892b0',
    marginTop: '10px',
  },
  heroDescription: {
    fontSize: '18px',
    color: '#8892b0',
    lineHeight: '1.6',
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px',
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  heroButton: {
    minWidth: '160px',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600' as const,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
  },
  features: {
    padding: '80px 0',
    backgroundColor: '#0a192f',
  },
  sectionTitle: {
    textAlign: 'center' as const,
    fontSize: '36px',
    marginBottom: '60px',
    color: '#e6f1ff',
    maxWidth: '1200px',
    margin: '0 auto 60px',
    padding: '0 20px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  featureCard: {
    textAlign: 'center' as const,
    padding: '40px 30px',
    background: 'rgba(17, 34, 64, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 255, 218, 0.1)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#e6f1ff',
  },
  featureDesc: {
    color: '#8892b0',
    lineHeight: '1.6',
  },
  footer: {
    backgroundColor: '#0a192f',
    borderTop: '1px solid rgba(100, 255, 218, 0.1)',
    padding: '40px 0',
  },
  footerContent: {
    textAlign: 'center' as const,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  footerText: {
    color: '#8892b0',
    margin: '20px 0',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap' as const,
  },
  footerLink: {
    color: '#64ffda',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  footerDivider: {
    color: '#8892b0',
  },
};

export default HomePage;