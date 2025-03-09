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
        dark: {
          50: "#edf2f7",
          100: "#1a1b1e",
          200: "#141517",
          300: "#0f1012",
          400: "#0a0b0c",
          500: "#050606",
          900: "#000000",
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
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },

        "quantum-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "quantum-float": {
          "0%, 100%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "0.3",
          },
          "50%": {
            transform: "translateY(-20px) rotate(180deg)",
            opacity: "0.8",
          },
        },
        "quantum-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "quantum-shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "quantum-ripple": {
          "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.3)",
          },
          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 10px rgba(99, 102, 241, 0)",
          },
          "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(99, 102, 241, 0)",
          },
        },
        "text-gradient-animation": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
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
    },
  },
  plugins: [addVariablesForColors, animate, typography],
} satisfies Config;
