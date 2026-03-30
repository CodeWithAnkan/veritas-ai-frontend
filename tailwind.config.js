/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0B',
          2: '#0F0F11',
          3: '#141417',
        },
        surface: {
          DEFAULT: '#17171A',
          2: '#1C1C20',
        },
        border: {
          DEFAULT: '#252528',
          2: '#2E2E33',
        },
        text: {
          DEFAULT: '#F0EDE8',
          2: '#9A9590',
          3: '#4A4845',
        },
        gold: {
          DEFAULT: '#C9A84C',
          2: '#E8C870',
          3: '#F5E0A0',
        },
        signal: {
          break: '#C94C4C',
          drift: '#C98A4C',
          stable: '#4C9A6A',
          info: '#4C7AC9',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'Menlo', 'monospace'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-25%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.8)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
