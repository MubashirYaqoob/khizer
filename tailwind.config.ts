import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        gold: "#b8943f",
        "gold-dark": "#9a7a2f",
        cream: "#faf8f5",
        surface: "#f9f9f9",
        "outline-light": "#c4c7c7",
        "text-muted": "#747878",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#444748",
      },
      fontFamily: {
        garamond: ["var(--font-garamond)", "Playfair Display", "Georgia", "serif"],
        playfair: ["var(--font-garamond)", "Playfair Display", "Georgia", "serif"],
        jost: ["var(--font-jost)", "Jost", "sans-serif"],
        montserrat: [
          "var(--font-montserrat)",
          "Inter",
          "Helvetica",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-lg-mobile": [
          "36px",
          { lineHeight: "1.2", fontWeight: "500" },
        ],
        "headline-md": [
          "32px",
          { lineHeight: "1.3", fontWeight: "400" },
        ],
        "headline-sm": [
          "24px",
          { lineHeight: "1.4", fontWeight: "400" },
        ],
        "body-lg": [
          "16px",
          { lineHeight: "1.6", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        "body-md": [
          "14px",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        "label-caps": [
          "12px",
          { lineHeight: "1.0", letterSpacing: "0.15em", fontWeight: "600" },
        ],
        "button-text": [
          "13px",
          { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "500" },
        ],
      },
      spacing: {
        "section-lg": "140px",
        "section-sm": "80px",
        "margin-desktop": "80px",
        "margin-mobile": "24px",
        gutter: "32px",
      },
      maxWidth: {
        container: "1440px",
      },
      borderRadius: {
        none: "0",
      },
      keyframes: {
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "ken-burns": "ken-burns 20s ease-in-out infinite alternate",
        "fade-up": "fade-up 0.6s ease-out forwards",
        pulse: "pulse 2s ease-in-out infinite",
        bounce: "bounce 1.5s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
