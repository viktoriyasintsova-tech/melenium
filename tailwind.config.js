/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        millennium: {
          yellow: "#F5FFC8",
          cream: "#faf8f4",
          ink: "#1C1C1C",
          dark: "#1A1208",
        },
      },
      boxShadow: {
        premium: "0 24px 70px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        denistina: ["Denistina", "cursive"],
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 20% 0%, rgba(212,175,55,0.18), transparent 50%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12), transparent 48%)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
        gentle: "cubic-bezier(0.33, 0, 0.2, 1)",
      },
      transitionDuration: {
        soft: "550ms",
        slower: "700ms",
        page: "480ms",
      },
    },
  },
  plugins: [],
};
