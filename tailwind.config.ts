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
        brand: {
          50: "#FFF0F2",
          100: "#FFDCE1",
          200: "#FFA3B4",
          300: "#FF6B87",
          400: "#FF335B",
          500: "#D0264C", // Crimson signature
          600: "#B2183C",
          700: "#900E2C",
          800: "#6F061E",
          900: "#4E0212",
        },
        navy: {
          50: "#FFF2F4",
          100: "#FFE5E9",
          200: "#FFCBD3",
          300: "#FFA2B0",
          400: "#FF6982",
          500: "#4A151D", // Main deep dark red/crimson signature for text & elements
          600: "#3D1018",
          700: "#300D13",
          800: "#240A0E",
          900: "#180609",
          950: "#0C0304",
        },
        blush: {
          DEFAULT: "#FBEAE1",
          50: "#FFF8F5",
          100: "#FDF1EB",
          200: "#FBEAE1",
          300: "#F7D5C4",
          400: "#F3C0A7",
          500: "#EEAB8A",
        },
        gold: {
          50: "#FFF8E6",
          100: "#FFEDB3",
          200: "#FFE180",
          300: "#FFD64D",
          400: "#FFCA1A",
          500: "#FFB800",
          600: "#CC9300",
          700: "#996E00",
          800: "#664A00",
          900: "#332500",
        },
        accent: {
          cyan: "#ff0000ff",
          purple: "#8B5CF6",
          pink: "#EC4899",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Poppins", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "linear-gradient(135deg, #FBEAE1 0%, #FFFFFF 50%, #FBEAE1 100%)",
        "gradient-brand":
          "linear-gradient(135deg, #D0264C 0%, #B2183C 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(208, 38, 76, 0.25)",
        "glow-lg": "0 0 40px rgba(208, 38, 76, 0.35)",
        "glow-gold": "0 0 20px rgba(255, 184, 0, 0.25)",
        glass: "0 8px 32px rgba(61, 20, 20, 0.05)",
        "glass-lg": "0 16px 64px rgba(61, 20, 20, 0.08)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "gradient": "gradient 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 0, 0, 0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
