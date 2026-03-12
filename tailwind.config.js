/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#5c7cfa",
          600: "#4c6ef5",
          700: "#4263eb",
          800: "#3b5bdb",
          900: "#364fc7",
          950: "#1e3a8a",
        },
        consul: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        hearth: {
          DEFAULT: "#ea580c",
          light: "#f97316",
          dark: "#c2410c",
        },
        lodge: {
          DEFAULT: "#059669",
          light: "#10b981",
          dark: "#047857",
        },
        command: {
          DEFAULT: "#7c3aed",
          light: "#8b5cf6",
          dark: "#6d28d9",
        },
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8fafc",
          tertiary: "#f1f5f9",
        },
        ink: {
          DEFAULT: "#0f172a",
          secondary: "#334155",
          tertiary: "#64748b",
          faint: "#94a3b8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
