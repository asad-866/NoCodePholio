// src/app/portfolio/about/page.tsx
import Skills from '@/components/skills';
import Resume from '@/components/resume';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Me | Anuj Jain Portfolio",
  description: "Learn about Anuj Jain's technical skills, including Python, AI/ML, Web Development, and IoT, and view his professional resume.",
};

export default function AboutPage() {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-12 px-4 py-12 md:py-24">
      <div className="w-full">
        <Skills />
      </div>
      <div className="w-full">
        <Resume />
      </div>
    </div>
  );
}