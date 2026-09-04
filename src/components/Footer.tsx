import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy' | 'career') => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTerms,
}) => {
  return (
    <footer className="bg-[#F8F8FA] text-brand-dark pt-12 md:pt-16 pb-12 border-t border-gray-200/90 relative overflow-hidden">
      <div className="max-w-site mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-gray-200">
          {/* Brand Column with balanced top spacing */}
          <div className="md:col-span-5 space-y-6">
            <div className="mb-6">
              <img
                src="/aurex-logo-dark-trimmed.png"
                alt="AUREX ESTATES"
                className="h-8 md:h-9 w-auto object-contain cursor-pointer"
                onClick={() => {
                  onNavigate('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            <p className="text-gray-800 text-base md:text-lg font-light leading-relaxed max-w-sm">
              “Not your average real estate broker. <br />
              <span className="text-gray-950 font-semibold">Your growth partner.</span>”
            </p>

            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed max-w-sm">
              Strategic real estate advisory serving discerning investors and high-end residential buyers across Delhi NCR.
            </p>

            {/* Recognized Social Icons */}
            <div className="flex items-center gap-3.5 pt-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/aurex.estates/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aurex Estates on Instagram"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:text-white hover:bg-brand-purple hover:border-brand-purple shadow-sm transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/aurexestatesgurugram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aurex Estates on Facebook"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:text-white hover:bg-brand-purple hover:border-brand-purple shadow-sm transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/aurex-estate/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aurex Estates on LinkedIn"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:text-white hover:bg-brand-purple hover:border-brand-purple shadow-sm transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.738-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@AUREXESTATES"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aurex Estates on YouTube"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] shadow-sm transition-all duration-300 group"
              >
                <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-purple font-semibold block mb-2">
              Navigation
            </span>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-700 hover:text-brand-purple transition-colors font-medium"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-700 hover:text-brand-purple transition-colors font-medium"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-700 hover:text-brand-purple transition-colors font-medium"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('career');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-700 hover:text-brand-purple transition-colors font-medium text-left"
                >
                  Career
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Coordinates Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-purple font-semibold block mb-2">
              Corporate Office
            </span>
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 text-gray-700 text-xs md:text-sm">
                <MapPin className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                <span className="font-light leading-relaxed">
                  1610, 16th Floor, Tower 4, DLF Corporate Greens, Sector 74A, Gurugram, Haryana - 122004
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700 text-xs md:text-sm">
                <Phone className="w-4 h-4 text-brand-purple shrink-0" />
                <a
                  href="tel:+918796791087"
                  className="hover:text-brand-purple font-medium transition-colors"
                >
                  +91 87967 91087
                </a>
              </div>

              <div className="flex items-center gap-3 text-gray-700 text-xs md:text-sm">
                <Mail className="w-4 h-4 text-brand-purple shrink-0" />
                <a
                  href="mailto:info@aurexestates.co.in"
                  className="hover:text-brand-purple font-medium transition-colors"
                >
                  info@aurexestates.co.in
                </a>
              </div>
            </div>

            {/* WhatsApp Advisory Action Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/918796791087"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-emerald-500/40 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-sm"
              >
                <span>Direct WhatsApp Advisory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-light">
          <p>© 2026 Aurex Estates. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                onNavigate('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-brand-purple transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-brand-purple transition-colors">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
