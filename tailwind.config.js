/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        surface: {
          DEFAULT: '#09090b',
          50: '#18181b',
          100: '#1c1c1f',
          200: '#27272a',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        'slide-up-d1': 'slideUp 0.6s ease-out 0.08s both',
        'slide-up-d2': 'slideUp 0.6s ease-out 0.16s both',
        'slide-up-d3': 'slideUp 0.6s ease-out 0.24s both',
        'slide-up-d4': 'slideUp 0.6s ease-out 0.32s both',
        'slide-up-d5': 'slideUp 0.6s ease-out 0.40s both',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
