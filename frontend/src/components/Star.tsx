import React from 'react';

const StarComponent: React.FC = () => {
  return (
    <div className={`relative w-48 h-48 flex items-center justify-center`}>
      <div className={`star-container absolute w-full h-full animate-spin-perpetual`}>
        {/* Layer 1 */}
        <div 
          className="star-layer absolute w-full h-full bg-gradient-to-br from-[var(--color-cyan-light)] to-[var(--color-bg-dark)] opacity-70"
          style={{ transform: 'rotateY(60deg) rotateX(20deg)' }}
        ></div>
        {/* Layer 2 */}
        <div 
          className="star-layer absolute w-full h-full bg-gradient-to-br from-[var(--color-teal-light)] to-[var(--color-cyan-dark)] opacity-70"
          style={{ transform: 'rotateY(-60deg) rotateX(20deg)' }}
        ></div>
        {/* Layer 3 */}
        <div 
          className="star-layer absolute w-full h-full bg-gradient-to-br from-sky-400 to-cyan-800 opacity-70"
          style={{ transform: 'rotateY(0deg) rotateX(-70deg) ' }}
        ></div>
      </div>
      {/* The "Light Burst" element */}
      <div className="glimmer-light absolute w-full h-full bg-radial-gradient from-cyan-300 via-teal-400 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
};

const Star = React.memo(StarComponent);
export default Star;
