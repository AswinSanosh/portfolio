import type { Metadata } from "next";
import "./globals.css";
import { portfolioData } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `${portfolioData.name} | ${portfolioData.title}`,
  description: `${portfolioData.title} skilled in ${portfolioData.skills.frameworks.slice(0, 4).join(", ")}. Building scalable, impactful applications.`,
  keywords: [portfolioData.name, portfolioData.title, ...portfolioData.skills.frameworks.slice(0, 4), ...portfolioData.skills.languages.slice(0, 2)],
  openGraph: {
    title: `${portfolioData.name} | ${portfolioData.title}`,
    description: "Explore my portfolio in an interactive VS Code experience.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-screen overflow-hidden bg-vscode-bg text-vscode-text font-mono">
        {children}
      </body>
    </html>
  );
}
