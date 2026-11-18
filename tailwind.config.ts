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
        // "Temple Bronze" palette — ink green-black, limestone, brass, verdigris
        ink: {
          950: "#0B0F0D",
          900: "#121A16",
          800: "#1A231E",
          700: "#24302A",
        },
        bone: {
          DEFAULT: "#EFEDE6",
          100: "#F5F3EC",
          200: "#E4E1D8",
          300: "#D6D2C6",
          400: "#BEB9AA",
        },
        brass: {
          DEFAULT: "#B08D57",
          bright: "#D6B98C",
          deep: "#8A6B3F",
        },
        verdigris: {
          DEFAULT: "#2F5D50",
          deep: "#22473D",
          light: "#4E8070",
        },
        oxblood: "#5A1F1F",
        smoke: "#6E6A63",
        // Legacy aliases so admin surfaces inherit the new palette untouched
        primary: "#121A16",
        accent: "#B08D57",
        surface: "#EFEDE6",
        "surface-dark": "#0B0F0D",
        "text-primary": "#121A16",
        "text-muted": "#6E6A63",
        success: "#2F5D50",
        border: "#D6D2C6",
        "card-bg": "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Legacy aliases
        cormorant: ["var(--font-display)", "Georgia", "serif"],
        dm: ["var(--font-sans)", "system-ui", "sans-serif"],
        playfair: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        none: "0px",
        card: "0px",
        button: "0px",
        chip: "0px",
        input: "0px",
        image: "0px",
      },
      fontSize: {
        display: ["clamp(3.2rem, 8vw, 6rem)", { lineHeight: "0.94", letterSpacing: "-0.03em" }],
        section: ["clamp(2rem, 4vw, 3.4rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        statement: ["clamp(1.35rem, 2.2vw, 2rem)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        lede: ["clamp(1.05rem, 1.4vw, 1.25rem)", { lineHeight: "1.55" }],
        body: ["17px", { lineHeight: "1.55" }],
        small: ["14px", { lineHeight: "1.5" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
        section: "clamp(96px, 12vw, 200px)",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
        curtain: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 1.5s infinite",
        "draw-line": "drawLine 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 11s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drawLine: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
