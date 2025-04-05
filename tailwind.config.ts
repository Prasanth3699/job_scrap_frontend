import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

// Properly type the plugin function
function addVariablesForColors({ addBase, theme }: PluginAPI) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#3b82f6", // blue-500
          secondary: "#10b981", // emerald-500
          accent: "#8b5cf6", // violet-500
          background: "#f8fafc", // slate-50
          text: "#1e293b", // slate-800
          card: "#ffffff",
        },
        dark: {
          primary: "#60a5fa", // blue-400
          secondary: "#34d399", // emerald-400
          accent: "#a78bfa", // violet-400
          background: "#000000", // pure black as requested
          text: "#e2e8f0", // slate-200
          card: "#0f172a", // slate-900
        },
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },

        primary: {
          50: "#f0f9ff",
          100: "#4f46e5",
          200: "#3c3ac2",
          300: "#2a2a9f",
          400: "#17177c",
          500: "#050459",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // primary: {
        //   DEFAULT: "hsl(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        quantum: {
          primary: "#4f46e5",
          secondary: "#3c3ac2",
          accent: "#2a2a9f",
          glow: "#6366f1",
          field: "rgba(99, 102, 241, 0.1)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "quantum-grid": `
          linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
        `,
        "quantum-radial":
          "radial-gradient(circle at center, var(--quantum-primary) 0%, transparent 70%)",
        "quantum-flow":
          "repeating-linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.1) 1px, transparent 1px, transparent 60px)",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        input:
          "`0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`",
      },

      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        " ": "float 6s ease-in-out infinite",

        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "quantum-pulse":
          "quantum-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "quantum-float": "quantum-float 3s ease-in-out infinite",
        "quantum-spin": "quantum-spin 4s linear infinite",
        "quantum-shimmer": "quantum-shimmer 3s ease-in-out infinite",
        "quantum-ripple": "quantum-ripple 3s infinite",
        "text-gradient": "text-gradient-animation 3s ease infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [addVariablesForColors, animate, typography],
} satisfies Config;
