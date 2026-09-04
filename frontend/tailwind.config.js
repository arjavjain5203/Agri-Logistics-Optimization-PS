/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#14532D',
        'forest-hover': '#0f3f22',
        'forest-light': '#1d7540',
        crop: '#4D7C0F',
        'crop-hover': '#3f650c',
        'crop-light': '#65a30d',
        gold: '#EAB308',
        'gold-hover': '#ca9a04',
        'gold-light': '#fde047',
        earth: '#92400E',
        'earth-hover': '#78350f',
        'earth-light': '#b45309',
        cream: '#F7F4EA',
        'cream-dark': '#ece6d5',
        charcoal: '#172016',
        'charcoal-muted': '#2c392a',
        sage: '#DDE7D8',
        'sage-dark': '#c7d5c0',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'bauhaus-sm': '2px 2px 0px #172016',
        'bauhaus': '4px 4px 0px #172016',
        'bauhaus-md': '6px 6px 0px #172016',
        'bauhaus-lg': '8px 8px 0px #172016',
        'bauhaus-white': '4px 4px 0px #FFFFFF',
        'bauhaus-gold': '4px 4px 0px #EAB308',
        'bauhaus-crop': '4px 4px 0px #4D7C0F',
      }
    },
  },
  plugins: [],
}
