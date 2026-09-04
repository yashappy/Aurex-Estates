import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  currentPage: 'home' | 'about' | 'contact' | 'privacy' | 'career';
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy' | 'career') => void;
  onOpenConsultation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; id: 'home' | 'about' | 'contact' }[] = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (pageId: 'home' | 'about' | 'contact') => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header-light py-3.5 shadow-sm shadow-black/[0.03]'
          : 'bg-white/95 backdrop-blur-md py-4 sm:py-5 border-b border-gray-100/80'
      }`}
    >
      <div className="max-w-site mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          aria-label="Aurex Estates Home"
        >
          <img
            src="/aurex-logo-dark-trimmed.png"
            alt="AUREX ESTATES"
            className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-1 focus:outline-none ${
                currentPage === item.id
                  ? 'text-brand-purple font-semibold'
                  : 'text-gray-700 hover:text-brand-purple'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <motion.span
                  layoutId="desktopActiveMenuIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-purple rounded-full shadow-sm shadow-brand-purple/40"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Primary CTA Button */}
        <div className="hidden md:flex items-center">
          <a
            href="https://wa.me/918796791087"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs uppercase tracking-[0.16em] font-semibold overflow-hidden shadow-md shadow-brand-purple/25 hover:bg-brand-purpleDark hover:shadow-lg hover:shadow-brand-purple/35 transition-all duration-300"
          >
            <span>Instant WhatsApp Chat</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Header Direct Action (Replaces Hamburger Menu) */}
        <div className="md:hidden flex items-center">
          <a
            href="https://wa.me/918796791087"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-purple text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm shadow-brand-purple/20 active:scale-95 transition-transform"
          >
            <span>WhatsApp</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
