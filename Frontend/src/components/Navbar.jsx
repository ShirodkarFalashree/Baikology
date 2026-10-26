import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Heart } from 'lucide-react';

export default function Navbar({ onOpenOnboarding, onOpenLogin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', href: '#features' },
    { label: 'Your Cycle', href: '#cycle' },
    { label: 'Mood & Wellness', href: '#mood' },
    { label: 'Learn', href: '#learn' },
    { label: 'About', href: '#about' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFAF5]/90 backdrop-blur-md py-3 shadow-[0_4px_20px_rgba(64,51,68,0.04)] border-b border-[#F9DDE5]/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#817583] rounded-full"
          aria-label="Baikology Home"
        >
          {/* Logo Flower Emblem */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F9DDE5] via-[#E9DFFF] to-[#FFF0B8] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <svg
              viewBox="0 0 32 32"
              className="w-6 h-6 text-[#403344]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft organic flower petals */}
              <circle cx="16" cy="10" r="5" fill="#F9DDE5" opacity="0.9" />
              <circle cx="22" cy="16" r="5" fill="#E9DFFF" opacity="0.9" />
              <circle cx="16" cy="22" r="5" fill="#FFF0B8" opacity="0.9" />
              <circle cx="10" cy="16" r="5" fill="#DDF3DE" opacity="0.9" />
              <circle cx="16" cy="16" r="3.5" fill="#403344" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#403344] font-['Nunito',sans-serif] flex items-center gap-1.5">
              Baikology
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E9DFFF]" />
            </span>
            <span className="text-[10px] tracking-wider text-[#817583] font-medium hidden sm:inline -mt-0.5">
              The Science of being 'her'
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#E9DFFF]/60 shadow-[0_2px_12px_rgba(64,51,68,0.03)]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3.5 py-1.5 text-sm font-medium text-[#403344] hover:text-[#756291] hover:bg-[#FFFAF5] rounded-full transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="text-sm font-semibold text-[#817583] hover:text-[#403344] px-3.5 py-2 rounded-full transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 text-[#756291]" />
            Find your flow
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-white border border-[#E9DFFF]/70 text-[#403344] hover:bg-[#FFFAF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#817583]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFAF5]/98 backdrop-blur-xl border-b border-[#E9DFFF] px-6 py-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-base font-semibold text-[#403344] hover:bg-[#F9DDE5]/40 rounded-2xl transition-colors flex items-center justify-between"
              >
                {link.label}
                <span className="text-xs text-[#817583]">→</span>
              </a>
            ))}

            <div className="pt-3 border-t border-[#E9DFFF]/60 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-3 text-center text-sm font-semibold text-[#817583] hover:text-[#403344] rounded-2xl bg-white border border-[#E9DFFF]/80"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full py-3.5 text-center text-sm font-bold text-[#403344] bg-gradient-to-r from-[#F9DDE5] via-[#E9DFFF] to-[#DDF3DE] rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#756291]" />
                Find your flow
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
