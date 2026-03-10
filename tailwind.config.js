/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tour-primary': '#00529B', // Màu xanh đặc trưng du lịch
      }
    },
  },
  plugins: [],
}