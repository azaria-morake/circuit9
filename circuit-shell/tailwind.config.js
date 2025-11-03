/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shell: {
          bg: '#071018',
          primary: '#00F0D0',
          secondary: '#0EB0A6',
          accent: '#FF3B30',
          text: '#E6F7F7',
          muted: '#4B5563',
          corruption: '#A66EFF'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'flicker': 'flicker 3s linear infinite',
        'glitch': 'glitch 0.3s linear infinite',
        'scanline': 'scanline 2s linear infinite',
        'typewriter': 'typewriter 4s steps(40) infinite'
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      }
    },
  },
  plugins: [],
}
