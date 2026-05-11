import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
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
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23007acc%22 /><path d=%22M30 35l-15 15 15 15M70 35l15 15-15 15%22 fill=%22none%22 stroke=%22white%22 stroke-width=%228%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 /><path d=%22M55 30l-10 40%22 fill=%22none%22 stroke=%22white%22 stroke-width=%228%22 stroke-linecap=%22round%22 /></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H5H95JG5SC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H5H95JG5SC');
          `}
        </Script>
      </head>
      <body className="h-screen overflow-hidden bg-vscode-bg text-vscode-text font-mono">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
