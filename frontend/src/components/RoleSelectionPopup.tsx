import React from 'react';
import { Role } from '../types/types';
import GradientBorderBox from './GradientBorderBox';

interface RoleSelectionPopupProps {
  onSelectRole: (role: Role) => void;
}

const RoleSelectionPopup: React.FC<RoleSelectionPopupProps> = ({ onSelectRole }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-20 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-white animate-slide-down">Choose Your Role</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-[-15px] bg-[var(--color-glow-cyan)] rounded-full blur-3xl opacity-25 -z-10 animate-color-cycle"></div>
          <GradientBorderBox className="from-[var(--color-cyan-light)] to-[var(--color-teal-dark)]">
            <div 
              className="w-64 h-40 flex items-center justify-center bg-black/20 backdrop-blur-lg rounded-lg cursor-pointer group transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-cyan-glow"
              onClick={() => onSelectRole('Admin')}
            >
              <span className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">Admin</span>
            </div>
          </GradientBorderBox>
        </div>
        <div className="animate-slide-up relative" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-[-15px] bg-[var(--color-glow-cyan)] rounded-full blur-3xl opacity-25 -z-10 animate-color-cycle" style={{ animationDelay: '2.5s' }}></div>
          <GradientBorderBox className="from-[var(--color-teal-light)] to-[var(--color-cyan-dark)]">
            <div 
              className="w-64 h-40 flex items-center justify-center bg-black/20 backdrop-blur-lg rounded-lg cursor-pointer group transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-teal-glow"
              onClick={() => onSelectRole('User')}
            >
              <span className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">User</span>
            </div>
          </GradientBorderBox>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPopup;