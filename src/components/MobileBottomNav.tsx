import React from 'react';
import { Home, Building2, Briefcase, Compass, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export type NavPage = 'home' | 'about' | 'contact' | 'privacy' | 'career' | 'residential' | 'commercial' | 'plots' | 'blog' | 'project-detail' | 'tools';

interface MobileBottomNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  const navItems: {
    id: 'home' | 'residential' | 'commercial' | 'plots' | 'tools';
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'residential', label: 'Residential', icon: Building2 },
    { id: 'commercial', label: 'Commercial', icon: Briefcase },
    { id: 'plots', label: 'Plots', icon: Compass },
    { id: 'tools', label: 'Tools', icon: Calculator },
  ];

  const handleTabClick = (pageId: 'home' | 'residential' | 'commercial' | 'plots' | 'tools') => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Floating Mobile Navigation Menu"
      className="fixed bottom-3 left-3 right-3 sm:left-4 sm:right-4 max-w-md mx-auto z-40 md:hidden bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(13,13,18,0.14),0_2px_10px_rgba(107,57,244,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] rounded-2xl p-1.5"
    >
      <div className="grid grid-cols-[0.9fr_1.2fr_1.2fr_0.85fr_0.85fr] gap-1 items-center w-full relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="w-full flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl relative select-none transition-all duration-200 active:scale-95 min-h-[48px]"
            >
              {/* Liquid Glassmorphism Smooth Travel Capsule */}
              {isActive && (
                <motion.div
                  layoutId="liquidActiveTabPill"
                  className="absolute inset-0 bg-brand-purple/10 border border-brand-purple/20 rounded-xl shadow-[0_4px_16px_rgba(107,57,244,0.14),inset_0_1px_2px_rgba(255,255,255,0.85)] backdrop-blur-sm z-0"
                  transition={{
                    type: 'spring',
                    stiffness: 440,
                    damping: 32,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Icon & Label */}
              <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-all duration-200 ${
                    isActive
                      ? 'text-brand-purple scale-110 stroke-[2.3]'
                      : 'text-gray-500 stroke-[1.6]'
                  }`}
                />
                <span
                  className={`text-[9.5px] tracking-tight leading-tight whitespace-nowrap transition-colors duration-200 text-center ${
                    isActive ? 'text-brand-purple font-bold' : 'text-gray-600 font-medium'
                  }`}
                >
                  {item.label}
                </span>

                {/* Animated active dot traveling alongside */}
                {isActive && (
                  <motion.span
                    layoutId="liquidActiveDot"
                    className="w-1 h-1 rounded-full bg-brand-purple mt-0.5 shadow-sm shadow-brand-purple"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
