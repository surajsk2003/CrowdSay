import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import InstallPrompt from "@/components/InstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdSay - Social Voting Platform",
  description: "Vote on trending topics and share your opinion with the world",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["voting", "polls", "social", "opinions", "democracy", "surveys"],
  authors: [{ name: "CrowdSay Team" }],
  creator: "CrowdSay",
  publisher: "CrowdSay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://crowdsay.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crowdsay.vercel.app",
    title: "CrowdSay - Social Voting Platform",
    description: "Vote on trending topics and share your opinion with the world",
    siteName: "CrowdSay",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdSay - Social Voting Platform",
    description: "Vote on trending topics and share your opinion with the world",
    creator: "@crowdsay",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CrowdSay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <InstallPrompt />
            <OfflineIndicator />
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
