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
      className="fixed bottom-3 left-4 right-4 z-40 md:hidden bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(13,13,18,0.14),0_2px_10px_rgba(107,57,244,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] rounded-2xl px-1.5 py-1.5"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl relative select-none transition-all duration-200 active:scale-95"
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
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-all duration-200 ${
                    isActive
                      ? 'text-brand-purple scale-110 stroke-[2.3]'
                      : 'text-gray-500 stroke-[1.6]'
                  }`}
                />
                <span
                  className={`text-[10px] tracking-tight leading-none transition-colors duration-200 truncate max-w-[70px] text-center ${
                    isActive ? 'text-brand-purple font-semibold' : 'text-gray-500 font-medium'
                  }`}
                >
                  {item.label}
                </span>

                {/* Animated active dot traveling alongside */}
                {isActive && (
                  <motion.span
                    layoutId="liquidActiveDot"
                    className="w-1 h-1 rounded-full bg-brand-purple mt-1 shadow-sm shadow-brand-purple"
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
