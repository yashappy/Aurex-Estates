/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8B2BE2",      // Primary Brand Colour
          purpleDark: "#6A1FB3",
          purpleLight: "#A64DF0",
          lavender: "#F5F0FC",    // Very light lavender
          lavenderSubtle: "#EFE8FA",
          dark: "#0D0D12",        // Near-black background
          darkSurface: "#14141B", // Dark container surface
          charcoal: "#1F2028",    // Charcoal
          softGrey: "#E9E9EE",    // Soft grey
          muted: "#8E8E9F",
          warmWhite: "#FAF9F6",   // Warm off-white
        }
      },
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        serif: ['Montserrat', 'sans-serif'],
        mono: ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.22em',
        'subtle': '0.08em',
        'tight-editorial': '-0.02em',
      },
      animation: {
        'marquee-left': 'marqueeLeft 36s linear infinite',
        'marquee-right': 'marqueeRight 36s linear infinite',
        'ken-burns': 'kenBurns 18s ease-in-out infinite alternate',
      },
      keyframes: {
        marqueeLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1.0) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
      },
      maxWidth: {
        'site': '1320px',
      }
    },
  },
  plugins: [],
}
