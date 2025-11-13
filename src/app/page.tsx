// src/app/page.tsx
import { ProjectForm } from '@/components/ProjectForm/ProjectForm';
import Navbar from '@/components/Navbar/Navbar'; // <-- IMPORT NAVBAR

export default function Home() {
  return (
    // Add padding-top to account for the fixed navbar
    <main className="w-full pt-20"> {/* pt-20 for navbar offset */}
      <Navbar /> {/* <-- ADDED NAVBAR */}
      <ProjectForm />
    </main>
  );
}