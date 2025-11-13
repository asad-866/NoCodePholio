// app/layout.tsx
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// --- Import your new components ---
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Your existing metadata is perfect, no changes needed here.
  title: {
    default: "Anuj Jain - Full-stack Python Developer & AI Engineer | Professional Portfolio",
    template: "%s | Anuj Jain Portfolio"
  },
  description: "Professional portfolio of Anuj Jain - Full-stack Python Developer & AI Engineer. SIH 2025 Finalist showcasing 25+ automation projects, IoT systems, and AI-powered solutions. Available for internships.",
  // ... all your other metadata ...
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Your existing head content is perfect */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* ... all your other head tags ... */}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // You might want "dark" based on your design
          enableSystem={false} // This is correct
        >
          {/* --- Add Navbar here --- */}
          <Navbar />

          {/* --- Add padding-top to main to avoid navbar overlap --- */}
          <main className="flex min-h-screen flex-col items-center py-30">
            {children}
          </main>

          {/* --- Add Footer here --- */}
          <Footer />
          
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}