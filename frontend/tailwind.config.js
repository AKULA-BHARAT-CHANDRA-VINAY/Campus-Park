/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        'cyan-dark': '#083344',
        'cyan-light': '#06b6d4',
        'teal-dark': '#115e59',
        'teal-light': '#14b8a6',
        'bg-dark': '#020617',
        'bg-light': '#0f172a',
        'glow-cyan': '#155e75',
        'glow-green': '#065f46',
        'glow-orange': '#9a3412',
        'glow-pink': '#9d174d',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'spin-perpetual': 'spin-perpetual 25s infinite linear',
        'light-burst': 'light-burst 3s ease-in-out forwards',
        'animated-gradient': 'animated-gradient 6s ease infinite',
        'pulse': 'pulse 4s ease-in-out infinite',
        'color-cycle': 'cycle-colors 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in-out forwards',
        'slide-down': 'slide-down 0.5s ease-in-out forwards',
        'slide-down-sm': 'slide-down-sm 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-in-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'spin-perpetual': {
          'from': { transform: 'rotateY(0deg) rotateX(10deg) rotateZ(0deg)' },
          'to': { transform: 'rotateY(360deg) rotateX(10deg) rotateZ(360deg)' },
        },
        'light-burst': {
          '0%': { opacity: '0', transform: 'scale(0.2)' },
          '50%': { opacity: '1', transform: 'scale(1.8)' },
          '100%': { opacity: '0', transform: 'scale(0.2)' },
        },
        'animated-gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.9))' },
        },
        'cycle-colors': {
          '0%, 100%': { backgroundColor: 'var(--color-glow-cyan)' },
          '25%': { backgroundColor: 'var(--color-glow-green)' },
          '50%': { backgroundColor: 'var(--color-glow-orange)' },
          '75%': { backgroundColor: 'var(--color-glow-pink)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-down': {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down-sm': {
          'from': { opacity: '0', transform: 'translateY(-5px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          'from': { opacity: '0', transform: 'translateX(100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scans all React files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'cyan-dark': '#083344',
        'cyan-light': '#06b6d4',
        'teal-dark': '#115e59',
        'teal-light': '#14b8a6',
        'bg-dark': '#020617',
        'bg-light': '#0f172a',
        'glow-cyan': '#155e75',
        'glow-green': '#065f46',
        'glow-orange': '#9a3412',
        'glow-pink': '#9d174d',
      },
    },
  },
  plugins: [],
}
