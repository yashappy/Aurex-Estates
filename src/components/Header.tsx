import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
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
        {/* Logo (Dark text with signature purple bar) */}
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
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-purple rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Primary CTA Button */}
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

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-900 hover:text-brand-purple transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 px-6 py-6 shadow-xl animate-fadeIn">
          <nav className="flex flex-col gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-base font-medium tracking-wide transition-colors ${
                  currentPage === item.id ? 'text-brand-purple font-semibold' : 'text-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-gray-100">
              <a
                href="https://wa.me/918796791087"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-purple text-white text-xs uppercase tracking-wider font-semibold shadow-md shadow-brand-purple/25"
              >
                <span>Instant WhatsApp Chat</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
