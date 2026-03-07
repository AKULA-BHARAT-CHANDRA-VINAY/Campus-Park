import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onContactClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onContactClick }) => {
  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-gradient-to-br from-[var(--color-bg-dark)] via-[var(--color-cyan-dark)] to-[var(--color-bg-dark)]">
      {/* Animated Ambient Light Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-cyan-light)] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--color-teal-light)] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[var(--color-cyan-light)] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll to see more</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[var(--color-cyan-light)] shadow-md shrink-0">
            <img
              src="/images/logo.png"
              alt="MVGR Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-white font-bold text-base md:text-xl font-sans">Campus Park</h1>
            <p className="text-gray-400 text-[10px] md:text-sm font-sans hidden sm:block">College Project • Parking & Access</p>
          </div>
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <button onClick={() => window.location.reload()} className="text-white hover:text-[var(--color-cyan-light)] transition-colors bg-transparent border-none cursor-pointer text-sm md:text-base">Home</button>
          <button className="text-white hover:text-[var(--color-cyan-light)] transition-colors bg-transparent border-none cursor-pointer text-sm md:text-base">About</button>
          <button
            onClick={onContactClick || (() => { })}
            className="text-white hover:text-[var(--color-cyan-light)] transition-colors bg-transparent border-none cursor-pointer text-sm md:text-base"
          >
            Contact Us
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] py-12 md:py-16 px-6 md:px-8">
        <div className="w-full max-w-6xl">
          {/* Glassmorphic Card */}
          <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--color-cyan-light)] via-[var(--color-teal-light)] to-[var(--color-cyan-light)] opacity-30 blur-xl animate-gradient-x"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-gray-900/40 backdrop-blur-xl"></div>
            </div>

            <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Section */}
              <div className="space-y-4 md:space-y-6 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-sans">
                  AI & ML DRIVEN SMART PARKING SYSTEM
                </h2>
                <p className="text-gray-300 text-base md:text-xl leading-relaxed font-sans mt-2">
                  A digital parking management system for efficient and organized campus mobility.
                  Built to support a smarter MVGR campus.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                  <button
                    onClick={onGetStarted}
                    className="px-8 py-3 md:py-4 bg-[var(--color-cyan-light)] text-white font-bold rounded-lg hover:bg-[var(--color-cyan-dark)] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50 text-sm md:text-base"
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* Right Section - Image */}
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/image.png"
                    alt="MVGR Campus"
                    className="w-full h-auto object-cover"
                  />
                  {/* Image overlay glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Section */}
      <div className="relative z-10 px-6 md:px-8 pb-12 md:pb-16">
        <div className="w-full max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12 font-sans">
            Booking Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: Booking Availability */}
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden p-6 md:p-8 hover:border-[var(--color-cyan-light)] transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-cyan-light)]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-[var(--color-cyan-light)]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🕐</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 font-sans">Booking Availability</h4>
                <p className="text-gray-300 leading-relaxed font-sans">
                  Bookings are available from <span className="text-[var(--color-cyan-light)] font-semibold">00:00 (midnight)</span> to <span className="text-[var(--color-cyan-light)] font-semibold">15:30 (3:30 PM)</span> every day.
                </p>
              </div>
            </div>

            {/* Card 2: Automatic Reset */}
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden p-6 md:p-8 hover:border-[var(--color-cyan-light)] transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-cyan-light)]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-[var(--color-cyan-light)]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 font-sans">Automatic Reset</h4>
                <p className="text-gray-300 leading-relaxed font-sans">
                  All parking slots automatically reset to <span className="text-[var(--color-cyan-light)] font-semibold">available</span> at <span className="text-[var(--color-cyan-light)] font-semibold">midnight (00:00)</span> every day.
                </p>
              </div>
            </div>

            {/* Card 3: Booking Prevention */}
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden p-6 md:p-8 hover:border-[var(--color-cyan-light)] transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-cyan-light)]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-[var(--color-cyan-light)]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚫</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 font-sans">Booking Prevention</h4>
                <p className="text-gray-300 leading-relaxed font-sans">
                  No bookings are allowed after <span className="text-[var(--color-cyan-light)] font-semibold">3:30 PM (15:30)</span>. The system will prevent any booking attempts after this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

