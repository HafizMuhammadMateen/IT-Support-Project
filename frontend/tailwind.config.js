/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryDark: "#174766",  // 20% darker
        primary: "#1D597D",      // Original primary color
        primaryLight: "#5E9FCC", // 30% lighter
        primaryLighter: "#77B7E6", // 40% lighter
        primaryExtraLight: "#90CFFF", // 50% lighter
      },      
    },
  },
  plugins: [],
};