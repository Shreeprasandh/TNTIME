/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── War Room Palette ───────────────────
        'void':      '#000000',   // true black background
        'bunker':    '#0a0a0f',   // deep panel bg
        'gunmetal':  '#111118',   // card bg
        'steel':     '#1a1a26',   // border/divider
        'muted':     '#3a3a52',   // muted text
        // ─── Neon Accents ───────────────────────
        'neon-green':   '#39ff14',  // primary glow
        'neon-crimson': '#ff2a2a',  // alerts / politics
        'neon-yellow':  '#ffdd00',  // accidents
        'neon-cyan':    '#00e5ff',  // weather
        'neon-orange':  '#ff6600',  // crime
        'neon-slate':   '#94a3b8',  // other / dim
      },
      fontFamily: {
        // ─── Display & UI ───────────────────────
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        // ─── Hacker readouts, timestamps, metrics
        'mono': ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 4px 1px currentColor',
            opacity: '1',
          },
          '50%': {
            boxShadow: '0 0 12px 4px currentColor',
            opacity: '0.8',
          },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.7' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-glow':   'pulse-glow 2s ease-in-out infinite',
        'scan-line':    'scan-line 8s linear infinite',
        'fade-in-up':   'fade-in-up 0.3s ease-out both',
        'blink-cursor': 'blink-cursor 1s step-end infinite',
        'flicker':      'flicker 4s ease-in-out infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
