/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        'dark-base': '#1C1917',
        'dark-surface': '#262320',
        'dark-card': '#262320',
        'dark-card-hover': '#2E2A26',
        'light-base': '#F5F2EB',
        'light-surface': '#EDE8DE',
        'light-card': '#FFFFFF',
        'bronze': '#D4A373',
        'bronze-dim': '#C68B59',
      },
      animation: {
        'spin-slow': 'spin 9s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'flip-icon': 'flipIcon 0.5s ease-in-out',
        'roll-flag': 'rollFlag 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212,163,115,0.3), 0 0 20px rgba(212,163,115,0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(212,163,115,0.6), 0 0 50px rgba(212,163,115,0.3), 0 0 80px rgba(212,163,115,0.1)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        flipIcon: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '49%': { transform: 'scale(0) rotate(180deg)', opacity: '0' },
          '50%': { transform: 'scale(0) rotate(180deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        rollFlag: {
          '0%': { transform: 'translateX(0) rotateY(0deg)', opacity: '1' },
          '49%': { transform: 'translateX(-8px) rotateY(90deg)', opacity: '0' },
          '50%': { transform: 'translateX(8px) rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotateY(0deg)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212,163,115,0.4)',
        'glow-sm': '0 0 10px rgba(212,163,115,0.3)',
        'glow-lg': '0 0 40px rgba(212,163,115,0.5)',
        'card': '0 4px 20px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(212,163,115,0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
