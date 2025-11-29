/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        okanime: {
          // Couleurs principales
          'primary': '#7C3AED',        // Violet
          'secondary': '#EC4899',      // Rose
          'accent': '#06B6D4',         // Cyan
          
          // Couleurs neutres (fond)
          'base-100': '#0A0A14',       // Fond principal
          'base-200': '#1A1A2E',       // Fond secondaire
          'base-300': '#262640',       // Fond tertiaire
          
          // Couleurs de texte
          'base-content': '#F8FAFC',   // Texte principal
          
          // Couleurs fonctionnelles
          'success': '#10B981',        // Vert
          'warning': '#F59E0B',        // Orange
          'info': '#3B82F6',           // Bleu
          'error': '#EF4444',          // Rouge
        },
      },
    ],
  },
}