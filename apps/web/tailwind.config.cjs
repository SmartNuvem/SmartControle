module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effcf6",
          100: "#d8f5e7",
          500: "#0f766e",
          600: "#0b5f59",
          700: "#11403d",
        },
      },
      boxShadow: {
        card: "0 12px 30px rgba(6, 78, 59, 0.08)",
      },
    },
  },
  plugins: [],
};
