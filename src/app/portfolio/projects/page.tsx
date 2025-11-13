// src/app/portfolio/projects/page.tsx
import AllProjects from '@/components/projects/AllProjects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects | Anuj Jain Portfolio",
  description: "Explore Anuj Jain's project portfolio, featuring AI-powered applications, web development, and IoT systems.",
};

export default function ProjectsPage() {
  return (
    <div className="flex w-full flex-col items-center px-4 py-12 md:py-24">
      <div className="w-full">
        <AllProjects />
      </div>
    </div>
  );
}