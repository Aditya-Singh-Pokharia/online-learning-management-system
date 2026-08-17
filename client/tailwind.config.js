/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6fe',
          200: '#bfd2fe',
          300: '#93b1fd',
          400: '#6089fa',
          500: '#4f6ef7',
          600: '#3d54e0',
          700: '#3143b8',
          800: '#2c3993',
          900: '#293475',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
        },
        ink: '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 8px 24px -8px rgb(15 23 42 / 0.10)',
        lift: '0 12px 32px -12px rgb(79 110 247 / 0.35)',
        glow: '0 0 0 1px rgb(79 110 247 / 0.08), 0 8px 30px -8px rgb(79 110 247 / 0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f6ef7 0%, #7c5cf5 55%, #d946ef 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #eef4ff 0%, #f3ecff 55%, #fdf4ff 100%)',
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)',
      },
      keyframes: {
        fadeInUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
