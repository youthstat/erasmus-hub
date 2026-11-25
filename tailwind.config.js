export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#111111', sun: '#FFE600', neon: '#00E676', hot: '#FF4766', cobalt: '#2E5BFF', paper: '#F7F6F2', mute: '#6E6954' },
      fontFamily: { sans: ['Space Grotesk', 'sans-serif'], mono: ['Space Mono', 'monospace'] },
      boxShadow: { b2: '2px 2px 0 #111', b4: '4px 4px 0 #111', b6: '6px 6px 0 #111', b8: '8px 8px 0 #111' },
      keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } },
      animation: { marquee: 'marquee 24s linear infinite' },
    },
  },
};
