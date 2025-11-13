// components/Navbar/Navbar.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// I'll use react-icons, which you should have from our previous steps.
import {
  FaUserCircle, FaCog, FaSignOutAlt, FaSignInAlt,
  FaBars, FaTimes
} from 'react-icons/fa';

const Navbar: React.FC = () => {
  // A simple state to simulate if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/70 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            NoCodePholio
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
              Chat
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          {/* Auth & Profile Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-2xl text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Profile menu"
                >
                  <FaUserCircle />
                </button>
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-lg shadow-lg py-1 overflow-hidden animate-in fade-in-0 zoom-in-95">
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                      <FaUserCircle /> Profile
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                      <FaCog /> Settings
                    </Link>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-accent border-t border-border"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoggedIn(true)}
                className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FaSignInAlt /> Login
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl text-muted-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border py-4 animate-in slide-in-from-top-2">
          <Link href="/" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
            Home
          </Link>
          <Link href="/chat" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
            Chat
          </Link>
          <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-accent rounded-md">
            About
          </Link>
          {!isLoggedIn && (
             <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
              >
                <FaSignInAlt /> Login
              </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;