/** @type {import('tailwindcss').Config} */
// Theme 2: The Velvet Zenith Palette
const colors = {
  'base-navy': '#10141D',      // Deep Navy / Midnight Blue
  'card-taupe': '#28242D',     // Warm Taupe Gray
  'text-cream': '#F0EAD6',     // Cream / Pale Gold
  'text-lavender': '#A3A7B8',  // Muted Lavender
  'cta-copper': '#C75A38',     // Burnt Sienna / Copper
  'highlight-wine': '#A32D4C', // Deep Wine Red
  'divider-silver': '#454A56', // Soft Silver
};

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: colors,
      // Implement Typography Pairing
      fontFamily: {
        // Cormorant Garamond for elegant headings
        headings: ['var(--font-cormorant-garamond)', 'serif'],
        // Poppins for clean body copy and UI elements
        body: ['var(--font-poppins)', 'sans-serif'],
      },
      // Implement Component Styling
      borderRadius: {
        // Soft & Elegant: 8px to 10px
        'soft-lg': '10px', 
      },
      boxShadow: {
        // Soft, Deep Outer Shadow for depth against the dark background
        'luxury-soft': '0 15px 40px rgba(0, 0, 0, 0.4)',
        // Muted Lavender glow for focus states (micro-interaction)
        'lavender-glow': '0 0 10px rgba(163, 167, 184, 0.6)', 
      },
      spacing: {
        // Open & Relaxed Spacing (Multiples of 10)
        '10': '40px',
        '15': '60px',
        '20': '80px',
        '25': '100px',
      },
      transitionTimingFunction: {
        // Custom cubic-bezier for "Buttery Smooth" feel
        'luxury-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)', 
      },
      // Implement Animations
      keyframes: {
        // Elegant fade-in animation
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Smooth slide-in from bottom
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Lavender glow pulse for focus states
        'lavender-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(163, 167, 184, 0.6)' },
          '50%': { boxShadow: '0 0 20px rgba(163, 167, 184, 0.9)' },
        },
        // Subtle scale animation for luxury feel
        'luxury-scale': {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Smooth shimmer effect
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        // Fade in with luxury ease timing
        'fade-in': 'fade-in 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        // Slide up animation
        'slide-up': 'slide-up 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        // Lavender glow pulse for interactive elements
        'lavender-pulse': 'lavender-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Luxury scale entrance
        'luxury-scale': 'luxury-scale 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        // Shimmer effect for loading states
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;