/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: { colors: { primary: "#2563eb", secondary: "#facc15", accent: "#a855f7", background: "#f9fafb", card: "#ffffff" }, fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] }, },
    extend: {},
  },
  plugins: [],
}

