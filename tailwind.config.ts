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
        // Whop Native App Theme - Black & Orange
        background: {
          DEFAULT: '#000000', // Pure black
          secondary: '#121212', // Dark grey for main content
          tertiary: '#1A1A1A', // Slightly lighter for cards
          card: '#1A1A1A', // Card background
        },
        foreground: {
          DEFAULT: '#FFFFFF', // Pure white
          secondary: '#E5E5E5', // Light gray
          muted: '#A0A0A0', // Muted text
          accent: '#FF6B00', // Whop Orange
        },
        primary: {
          DEFAULT: '#FF6B00', // Whop Orange
          50: '#FFF4E6',
          100: '#FFE9CC',
          200: '#FFD399',
          300: '#FFBD66',
          400: '#FFA733',
          500: '#FF6B00', // Main Whop orange
          600: '#E55A00',
          700: '#CC4F00',
          800: '#B24400',
          900: '#993900',
          whop: '#FF6B00',
        },
        secondary: {
          DEFAULT: '#121212',
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#121212',
        },
        accent: {
          whop: '#FF6B00', // Whop Orange
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        border: {
          DEFAULT: '#333333',
          light: '#404040',
          dark: '#1A1A1A',
        },
        muted: {
          DEFAULT: '#1A1A1A',
          foreground: '#A0A0A0',
        },
        card: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF',
        },
        input: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF',
        },
        ring: {
          DEFAULT: '#FF6B00',
        },
        // Legacy colors for compatibility
        midnight: {
          DEFAULT: '#141212',
          50: '#FCF6F5',
          100: '#F6DCD5',
          200: '#EFE7FF',
          300: '#D7E1F7',
          400: '#D9F9CB',
          500: '#FFD9E7',
          600: '#F9FACE',
          700: '#141212',
          800: '#0F0E0E',
          900: '#0A0A0A',
        },
        text: {
          DEFAULT: '#FCF6F5',
          midnight: '#141212',
          light: '#FCF6F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(255, 107, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-pan': 'gradient-pan 6s ease-in-out infinite',
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
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B00 0%, #E55A00 100%)',
        'gradient-whop': 'linear-gradient(135deg, #FF6B00 0%, #CC4F00 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #121212 100%)',
        'gradient-card': 'linear-gradient(135deg, #1A1A1A 0%, #121212 100%)',
      },
    },
  },
  plugins: [],
};

export default config;