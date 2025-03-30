/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          ghibliGreen: '#504B38', // A vibrant, grassy green
          ghibliBeige: '#F8F3D9', // A warm, natural beige
          ghibliBlue: '#504B38',   // A soft, sky blue
          ghibliOrange: '#FFB74D', // A warm orange for accents
          ghibliDark: '#37474F',   // A dark grey-blue for text and backgrounds
        },
        fontFamily: {
          'display': ['"M PLUS Rounded 1c"', 'sans-serif'], // Requires import
          'body': ['"Noto Sans JP"', 'sans-serif'],       // Requires import
        },
        transitionProperty: {
          'height': 'height', // Add height transition
        },
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'slide-up': {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out',
          'slide-up': 'slide-up 0.5s ease-out',
        },
      },
    },
    plugins: [],
  }