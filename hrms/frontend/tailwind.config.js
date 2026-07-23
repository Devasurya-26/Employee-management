/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#b8c9ff',
          300: '#8ea6ff',
          400: '#647cff',
          500: '#4a56f0',
          600: '#3a3fd6',
          700: '#2f31ac',
          800: '#282a85',
          900: '#1e1f5f',
        },
        accent: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        surface: '#f7f8fc',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(30, 31, 95, 0.06), 0 1px 2px -1px rgba(30, 31, 95, 0.06)',
        elevated: '0 10px 25px -5px rgba(30, 31, 95, 0.1), 0 8px 10px -6px rgba(30, 31, 95, 0.08)',
      },
    },
  },
  plugins: [],
}
