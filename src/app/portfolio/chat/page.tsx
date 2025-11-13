// src/app/portfolio/chat/page.tsx
import Chat from '@/components/chat/chat';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Chat | Anuj Jain Portfolio",
  description: "Chat with Anuj Jain's AI-powered digital twin to ask questions about his projects, skills, and experience.",
};

export default function ChatPage() {
  return (
    <div className="w-full">
      <Chat />
    </div>
  );
}