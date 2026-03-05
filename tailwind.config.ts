import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E1A17",
        clay: "#D8C5AC",
        oat: "#F7F2EB",
        dune: "#B89A7A",
        pine: "#2B4034"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 12, 8, 0.08)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 700ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
