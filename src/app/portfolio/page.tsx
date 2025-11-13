// src/app/portfolio/page.tsx
import { Presentation } from '@/components/presentation';
import AvailabilityCard from '@/components/AvailabilityCard';
import { Contact } from '@/components/contact';
// --- config import no longer needed here ---
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Anuj Jain - Full-stack Python Developer & AI Engineer | Professional Portfolio",
  description: "Professional portfolio of Anuj Jain - Full-stack Python Developer & AI Engineer. SIH 2025 Finalist showcasing 25+ automation projects, IoT systems, and AI-powered solutions. Available for internships.",
};

export default function Home() {
  // --- config variable removed ---

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-12 px-4 py-12 md:py-24">
      <div className="w-full">
        <Presentation />
      </div>
      <div className="w-full">
        {/* --- MODIFIED: No data prop needed --- */}
        <AvailabilityCard />
      </div>
      <div className="w-full">
        <Contact />
      </div>
    </div>
  );
}