// components/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-16">
        {/* Column 1: Logo & Bio */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            NoCodePholio
          </Link>
          <p className="text-muted-foreground text-sm mt-3 max-w-xs">
            AI-powered portfolios, built in minutes.
          </p>
        </div>

        {/* Column 2: Platform */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-semibold text-foreground">Platform</h4>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chat</Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>

        {/* Column 3: Account */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-semibold text-foreground">Account</h4>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
          <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-semibold text-foreground">Legal</h4>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} NoCodePholio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;