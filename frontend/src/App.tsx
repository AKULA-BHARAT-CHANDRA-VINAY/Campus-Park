import React, { useState, useEffect } from 'react';
import { AppState } from './types/types';
import Star from './components/Star';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import ContactPage from './components/ContactPage';
import AnimatedBackground from './components/AnimatedBackground';
import Dashboard from './pages/Dashboard';
import BookingDetails from './pages/BookingDetails';
import ScannerSuccess from "./pages/ScannerSuccess";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');

  useEffect(() => {
    if (appState === 'intro') {
      const timer = setTimeout(() => {
        setAppState('landing');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  type AppState =
    | 'intro'
    | 'landing'
    | 'auth-form'
    | 'dashboard'
    | 'booking-details'
    | 'exit-scanner'
    | 'scanner-success'
    | 'contact';

  const [scannerSuccessData, setScannerSuccessData] = useState<any>(null);

  const handleGetStarted = () => {
    const username = localStorage.getItem('username');
    const isLoggedIn = username && username.trim() !== '';

    if (isLoggedIn) {
      setAppState('dashboard');
    } else {
      setAppState('auth-form');
    }
  };

  const handleContactClick = () => {
    setAppState('contact');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  // Render based on appState
  const renderContent = () => {
    switch (appState) {
      case 'intro':
        return (
          <div className="flex items-center justify-center h-full px-4 text-center">
            <div className="star-perspective">
              <Star />
            </div>
            <div className="z-10 text-white absolute">
              <h1 className="transition-all duration-1000 ease-in-out font-serif font-extrabold text-3xl md:text-5xl tracking-tight text-gradient opacity-100 translate-y-0 text-center">
                MVGR SMART PARKING SYSTEM. <br /><br />Seamless Access.
              </h1>
            </div>
          </div>
        );

      case 'contact':
        return <ContactPage onBack={handleBackToLanding} />;

      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} onContactClick={handleContactClick} />;

      case 'auth-form':
        return (
          <div className="flex flex-col md:flex-row h-full overflow-y-auto">
            <div className="w-full hidden sm:flex md:w-1/2 h-48 md:h-full items-center justify-center relative overflow-hidden shrink-0">
              <img src="/images/signin.jpg" alt="Sign In" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[var(--color-bg-dark)] min-h-[500px]">
              <div className="w-full max-w-md">
                <AuthForm
                  onBack={handleBackToLanding}
                  onLoginSuccess={() => {
                    const username = localStorage.getItem('username');
                    if (username && username.trim() !== '') {
                      setAppState('dashboard');
                    } else {
                      setAppState('landing');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <Dashboard
            onBack={() => setAppState('landing')}
            onExitScanner={() => setAppState('exit-scanner')}
            onScannerSuccess={(data) => {
              setScannerSuccessData(data);
              setAppState('scanner-success');
            }}
          />
        );

      case 'booking-details':
        return <BookingDetails onBack={() => setAppState('dashboard')} />;

      case 'scanner-success':
        return (
          <ScannerSuccess
            onBack={() => setAppState('dashboard')}
            areaLocation={scannerSuccessData?.areaLocation}
            areaName={scannerSuccessData?.areaName}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full ${appState === 'contact' || appState === 'landing' ? 'h-auto min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'} bg-[var(--color-bg-dark)]`}>
      <AnimatedBackground />
      {renderContent()}
    </div>
  );
};

export default App;