import React from 'react';
import { Home, Compass, PhoneCall, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileBottomNavProps {
  currentPage: 'home' | 'about' | 'contact' | 'privacy' | 'career';
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy' | 'career') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  const navItems: {
    id: 'home' | 'about' | 'contact';
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Compass },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  const handleTabClick = (pageId: 'home' | 'about' | 'contact') => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-3 left-4 right-4 z-50 md:hidden bg-white/75 backdrop-blur-2xl border border-white/70 shadow-[0_12px_40px_rgba(13,13,18,0.12),0_2px_12px_rgba(107,57,244,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)] rounded-2xl px-2 py-1.5"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-sm mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl relative select-none transition-colors duration-200"
            >
              {/* Liquid Glassmorphism Smooth Travel Capsule */}
              {isActive && (
                <motion.div
                  layoutId="liquidActiveTabPill"
                  className="absolute inset-0 bg-brand-purple/10 border border-brand-purple/20 rounded-xl shadow-[0_4px_16px_rgba(107,57,244,0.12),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-sm z-0"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 30,
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
                  className={`text-[10px] tracking-tight leading-none transition-colors duration-200 ${
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

        {/* Direct WhatsApp Chat Luxury Floating Action */}
        <a
          href="https://wa.me/918796791087?text=Hi%20Aurex%20Estates,%20I%20would%20like%20to%20inquire%20about%20real%20estate%20advisory."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp Advisory"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-600 active:scale-95 transition-all duration-300 border border-emerald-200/60 shadow-sm"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight leading-none">
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
};
