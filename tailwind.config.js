/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      colors: {
        abyss: { 950: '#030712', 900: '#060d1b', 850: '#0a1426', 800: '#0d1a30', 700: '#13233f', 600: '#1c3156' },
        cyan: { glow: '#22d3ee' },
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(34,211,238,0.45)',
        'glow-red': '0 0 24px -4px rgba(244,63,94,0.55)',
        'glow-green': '0 0 24px -4px rgba(52,211,153,0.5)',
      },
      keyframes: {
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        ping2: { '0%': { transform: 'scale(1)', opacity: '0.8' }, '100%': { transform: 'scale(3)', opacity: '0' } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        dash: { to: { strokeDashoffset: '-40' } },
        blink: { '50%': { opacity: '0' } },
        sweep: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        scan: 'scan 6s linear infinite',
        ping2: 'ping2 2s cubic-bezier(0,0,0.2,1) infinite',
        ticker: 'ticker 60s linear infinite',
        dash: 'dash 1.2s linear infinite',
        blink: 'blink 1s step-end infinite',
        sweep: 'sweep 4s linear infinite',
      },
    },
  },
  safelist: ['text-rose-400', 'text-emerald-400', 'text-amber-400'],
  plugins: [],
}
