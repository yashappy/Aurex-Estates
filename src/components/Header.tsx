import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsStore } from '../services/cmsStore';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenConsultation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerConfig, setHeaderConfig] = useState(() => cmsStore.getPageContent().header);

  useEffect(() => {
    const handleUpdate = () => {
      setHeaderConfig(cmsStore.getPageContent().header);
    };
    const unsubscribe = cmsStore.subscribe(handleUpdate);
    return () => {
      unsubscribe();
    };
  }, []);

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

  const navItems: { label: string; id: Page }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Residential', id: 'residential' },
    { label: 'Commercial', id: 'commercial' },
    { label: 'Plots', id: 'plots' },
    { label: 'Tools', id: 'tools' },
  ];

  const handleNavClick = (pageId: Page) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header-light py-3.5 shadow-sm shadow-black/[0.03]'
          : 'bg-white/95 backdrop-blur-md py-3.5 sm:py-4 border-b border-gray-100/80'
      }`}
    >
      <div className="max-w-site mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          aria-label="Aurex Estates Home"
        >
          <img
            src={headerConfig?.logoUrl || '/aurex-logo-dark-trimmed.png'}
            alt={headerConfig?.brandName || 'AUREX ESTATES'}
            className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/aurex-logo-dark-trimmed.png';
            }}
          />
        </button>

        {/* PC and Tablet Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 relative py-1 focus:outline-none ${
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

        {/* Actions: WhatsApp */}
        <div className="flex items-center gap-3">

          {(headerConfig?.whatsAppPlacement === 'top-header' ||
            headerConfig?.whatsAppPlacement === 'both' ||
            headerConfig?.whatsAppPlacement === 'floating-bottom-right') && (
            <a
              href="https://wa.me/918796791087"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.5px] border-[#25D366] text-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 hover:border-[#25D366] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm shadow-[#25D366]/20"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.16 1.6 5.97L0 24l6.23-1.63a11.94 11.94 0 0 0 5.83 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.87h-.01c-1.8 0-3.57-.48-5.11-1.4l-.37-.22-3.8 1 1.01-3.7-.24-.38a9.92 9.92 0 0 1-1.52-5.2c0-5.5 4.47-9.97 9.98-9.97 2.66 0 5.17 1.04 7.05 2.92a9.9 9.9 0 0 1 2.92 7.05c0 5.5-4.47 9.97-9.97 9.97zm5.46-7.46c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.41-1.49-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.63-.92-2.23-.25-.59-.5-.51-.68-.52-.18-.01-.38-.01-.58-.01-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.08-.13-.28-.2-.58-.35z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
