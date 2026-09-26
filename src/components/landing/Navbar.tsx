import React, { useState, useEffect } from 'react';
import { AuraLogo } from '../common/AuraLogo';
import { Sparkles, ArrowRight, Shield, Moon, Sun, Menu, X } from 'lucide-react';

interface NavbarProps {
  onStartChat: () => void;
  onOpenSecurity: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartChat,
  onOpenSecurity,
  theme,
  onToggleTheme,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070709]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <AuraLogo
          size="md"
          animated={true}
          showText={true}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9A9AA3]">
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('intelligence')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Intelligence
          </button>
          <button
            onClick={() => scrollToSection('experience')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={onOpenSecurity}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Security</span>
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Architecture
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#9A9AA3] hover:text-white transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Launch Application CTA */}
          <button
            onClick={onStartChat}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 cursor-pointer active:scale-95"
          >
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#0E0E12] border-b border-white/10 space-y-3">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-sm text-[#F5F5F7] font-medium"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('intelligence')}
            className="block w-full text-left py-2 text-sm text-[#F5F5F7] font-medium"
          >
            Intelligence
          </button>
          <button
            onClick={() => scrollToSection('experience')}
            className="block w-full text-left py-2 text-sm text-[#F5F5F7] font-medium"
          >
            Experience
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSecurity();
            }}
            className="block w-full text-left py-2 text-sm text-[#F5F5F7] font-medium"
          >
            Security & Privacy
          </button>
          <div className="pt-2">
            <button
              onClick={onStartChat}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-md"
            >
              <span>Start Chatting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
