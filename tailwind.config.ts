import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Whop-inspired Design System
        primary: {
          DEFAULT: '#FA4616', // DragonFire
          dragonfire: '#FA4616',
        },
        midnight: {
          DEFAULT: '#141212', // Midnight
          50: '#FCF6F5', // Snow
          100: '#F6DCD5', // Light tint
          200: '#EFE7FF', // Purple tint
          300: '#D7E1F7', // Blue tint
          400: '#D9F9CB', // Green tint
          500: '#FFD9E7', // Pink tint
          600: '#F9FACE', // Yellow tint
          700: '#141212', // Midnight
          800: '#0F0E0E', // Darker midnight
          900: '#0A0A0A', // Darkest midnight
        },
        accent: {
          lemonlime: '#DBF505', // LemonLime
          byzantine: '#1754D8', // ByzantineBlue
        },
        background: {
          DEFAULT: '#FCF6F5', // Snow
          snow: '#FCF6F5',
        },
        text: {
          DEFAULT: '#141212', // Midnight
          midnight: '#141212',
          light: '#FCF6F5', // Snow for dark backgrounds
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FA4616 0%, #E03E14 100%)',
        'gradient-accent': 'linear-gradient(135deg, #DBF505 0%, #C4E004 100%)',
        'gradient-byzantine': 'linear-gradient(135deg, #1754D8 0%, #1441B8 100%)',
        'gradient-midnight': 'linear-gradient(135deg, #141212 0%, #0F0E0E 100%)',
      },
    },
  },
  plugins: [],
};

export default config;