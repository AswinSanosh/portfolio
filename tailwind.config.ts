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
        vscode: {
          bg: "#1e1e1e",
          sidebar: "#252526",
          tabbar: "#2d2d2d",
          activetab: "#1e1e1e",
          border: "#3c3c3c",
          hover: "#2a2d2e",
          highlight: "#094771",
          text: "#d4d4d4",
          muted: "#858585",
          blue: "#4fc1ff",
          orange: "#ce9178",
          yellow: "#dcdcaa",
          green: "#6a9955",
          pink: "#c586c0",
          cyan: "#9cdcfe",
          red: "#f44747",
          purple: "#646695",
          statusbar: "#007acc",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "Consolas", "monospace"],
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "type-in": "typeIn 0.05s steps(1) forwards",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        slideInLeft: { from: { transform: "translateX(-20px)", opacity: "0" }, to: { transform: "translateX(0)", opacity: "1" } },
        slideInRight: { from: { transform: "translateX(20px)", opacity: "0" }, to: { transform: "translateX(0)", opacity: "1" } },
        fadeIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
