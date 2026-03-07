
import React from 'react';
import { useToggle } from '../hooks/useToggle';
import LockIcon from './icons/LockIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

const PasswordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [visible, toggle] = useToggle(false);

  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <LockIcon className="w-5 h-5" />
      </span>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        placeholder="Password"
        required
        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-gold-light)] focus:outline-none"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
