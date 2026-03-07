
import React from 'react';

interface GradientBorderBoxProps {
  children: React.ReactNode;
  className?: string;
}

const GradientBorderBox: React.FC<GradientBorderBoxProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`p-[2px] rounded-xl bg-gradient-to-r ${className}`}
      style={{
        backgroundSize: '200% 200%',
        animation: 'animated-gradient 4s ease infinite',
      }}
    >
      {children}
    </div>
  );
};

export default GradientBorderBox;
