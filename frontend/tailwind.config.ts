import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: {
          DEFAULT: "#141416",
          elevated: "#1C1C1F",
        },
        border: "rgba(255, 255, 255, 0.08)",
        text: {
          primary: "#F4F4F5",
          secondary: "#A1A1AA",
          muted: "#52525B",
        },
        accent: {
          primary: "#22C55E", // Electric green
          secondary: "#6366F1", // Cool violet/blue
        },
        status: {
          approved: "#22C55E",
          pending: "#F59E0B",
          error: "#EF4444",
          unknown: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        bengali: ["var(--font-noto-bengali)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
