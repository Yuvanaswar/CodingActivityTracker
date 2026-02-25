/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#0a0f1c', // Deep modern dark mode
        surface: '#121b2e',
        border: 'rgba(255,255,255,0.08)',
        subtle: 'rgba(255,255,255,0.05)',
        textMain: '#ffffff',
        textMuted: '#94a3b8',
        brand: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
          yellow: '#f59e0b',
        }
      },
      backgroundImage: {
        'gradient-main': 'radial-gradient(circle at top right, #1a2340 0%, #0a0f1c 100%)',
        'gradient-hero': 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}