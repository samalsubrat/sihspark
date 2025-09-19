import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import PWAInstaller from "@/components/pwa-installer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],

});

export const metadata: Metadata = {
  title: "SPARK - Water Quality Monitoring",
  description: "AI-powered water quality monitoring and waterborne disease prevention platform",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SPARK",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "SPARK",
    title: "SPARK - Water Quality Monitoring",
    description: "AI-powered water quality monitoring and waterborne disease prevention platform",
  },
  twitter: {
    card: "summary",
    title: "SPARK - Water Quality Monitoring",
    description: "AI-powered water quality monitoring and waterborne disease prevention platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="SPARK" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SPARK" />
        <meta name="description" content="AI-powered water quality monitoring and waterborne disease prevention platform" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Splash screens for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
      </head>
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        <PWAInstaller />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
