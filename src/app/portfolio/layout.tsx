// src/app/portfolio/layout.tsx
"use client";

// We use "use client" here to potentially read from localStorage
// for template switching in the future.

import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [template, setTemplate] = useState("1"); // Default template

  useEffect(() => {
    // In a real multi-template setup, you'd read this
    // and dynamically load different styles or components.
    const storedTemplate = localStorage.getItem("selectedTemplate") || "1";
    setTemplate(storedTemplate);
  }, []);

  // For now, we only have one template, so we just render
  // the default Navbar, Footer, and children.
  return (
    <>
      <Navbar />
      <main className="flex w-full flex-col items-center pt-20"> {/* pt-20 for navbar offset */}
        {children}
      </main>
      <Footer />
    </>
  );
}