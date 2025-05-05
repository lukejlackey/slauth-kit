module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./playground/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      colors: {
        "sloth-bg": "#f7f3ee",
        "sloth-green": "#4caf50",
        "sloth-text": "#4b4b4b"
      }
    }
  },
  plugins: []
}
