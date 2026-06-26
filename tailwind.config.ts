import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:       "#070B14",
          surface:  "#0D1220",
          border:   "rgba(255,255,255,0.07)",
          indigo:   "#6366F1",
          amber:    "#F59E0B",
          muted:    "#64748B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        blink:   "blink 1s step-end infinite",
        fadeIn:  "fadeIn 0.25s ease forwards",
        slideUp: "slideUp 0.3s ease forwards",
        pulse:   "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "indigo-glow": "0 0 30px rgba(99,102,241,0.25)",
        "amber-glow":  "0 0 20px rgba(245,158,11,0.15)",
      },
      backdropBlur: {
        md: "12px",
      },
    },
  },
  plugins: [],
};

export default config;