import React from 'react';
import { DeveloperLogo } from './DeveloperLogo';

export const LogoTicker: React.FC = () => {
  // ROW 1: 8 Unique Developer Brands
  const row1Logos = [
    { id: 'dlf', name: 'DLF' },
    { id: 'oberoi', name: 'Oberoi Realty' },
    { id: 'godrej', name: 'Godrej Properties' },
    { id: 'sobha', name: 'SOBHA' },
    { id: 'max', name: 'Max Estates' },
    { id: 'birla', name: 'Birla Estates' },
    { id: 'emaar', name: 'Emaar' },
    { id: 'ats', name: 'ATS HomeKraft' },
  ];

  // ROW 2: 8 Unique Developer Brands (Zero overlap with Row 1 & Row 3)
  const row2Logos = [
    { id: 'pareena', name: 'Pareena' },
    { id: 'ganga', name: 'Ganga Realty' },
    { id: 'hero', name: 'Hero Homes' },
    { id: 'elan', name: 'Elan Group' },
    { id: 'tata', name: 'Tata Housing' },
    { id: 'm3m', name: 'M3M' },
    { id: 'mahindra', name: 'Mahindra Lifespaces' },
    { id: 'adani', name: 'Adani Realty' },
  ];

  // ROW 3: 8 Unique Developer Brands (Zero overlap with Row 1 & Row 2)
  const row3Logos = [
    { id: 'signature', name: 'Signature Global' },
    { id: 'smartworld', name: 'Smart World' },
    { id: 'centralpark', name: 'Central Park' },
    { id: 'bptp', name: 'BPTP' },
    { id: 'puri', name: 'Puri' },
    { id: 'ireo', name: 'IREO' },
    { id: 'aipl', name: 'AIPL' },
    { id: 'wal', name: 'WAL Developers' },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-warmWhite text-brand-dark overflow-hidden relative border-b border-gray-200/70">
      <style>{`
        @keyframes ticker-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ticker-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .ticker-viewport {
          overflow: hidden !important;
          width: 100% !important;
          position: relative !important;
        }
        .ticker-track {
          display: flex !important;
          width: max-content !important;
          flex-wrap: nowrap !important;
          white-space: nowrap !important;
          will-change: transform !important;
        }
        .ticker-left-1 {
          animation: ticker-left 28s linear infinite !important;
        }
        .ticker-right {
          animation: ticker-right 32s linear infinite !important;
        }
        .ticker-left-2 {
          animation: ticker-left 30s linear infinite !important;
        }
        .logo-set {
          display: flex !important;
          align-items: center !important;
          flex-shrink: 0 !important;
          white-space: nowrap !important;
          gap: 1.5rem !important;
          padding-right: 1.5rem !important;
        }
      `}</style>

      {/* Editorial Section Header */}
      <div className="max-w-site mx-auto px-6 md:px-12 text-center mb-10 md:mb-14">
        <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
          INSTITUTIONAL DEVELOPER NETWORK
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
          Connected to Leading Developers.
        </h2>
      </div>

      {/* Edge Gradient Masks (Subtle fade at extreme left and right) */}
      <div className="relative w-full overflow-hidden space-y-4 md:space-y-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 md:w-56 bg-gradient-to-r from-brand-warmWhite via-brand-warmWhite/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 md:w-56 bg-gradient-to-l from-brand-warmWhite via-brand-warmWhite/80 to-transparent z-10 pointer-events-none" />

        {/* ROW 1: RIGHT -> LEFT (28s linear infinite, 8 unique logos) */}
        <div className="ticker-viewport" style={{ overflow: 'hidden', width: '100%' }}>
          <div
            className="ticker-track ticker-left-1"
            style={{
              display: 'flex',
              width: 'max-content',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              animation: 'ticker-left 28s linear infinite',
            }}
          >
            {/* LOGO SET */}
            <div
              className="logo-set"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: '1.5rem', paddingRight: '1.5rem' }}
            >
              {row1Logos.map((dev, idx) => (
                <div
                  key={`r1-s1-${dev.id}-${idx}`}
                  className="flex-shrink-0 shrink-0 whitespace-nowrap flex items-center justify-center px-7 py-3 rounded-xl bg-white border border-gray-200/80 shadow-sm min-w-[170px] md:min-w-[210px] h-[76px] md:h-[84px]"
                >
                  <DeveloperLogo id={dev.id} className="h-9 md:h-11" />
                </div>
              ))}
            </div>

            {/* IDENTICAL LOGO SET DUPLICATE */}
            <div
              className="logo-set"
              aria-hidden="true"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: '1.5rem', paddingRight: '1.5rem' }}
            >
              {row1Logos.map((dev, idx) => (
                <div
                  key={`r1-s2-${dev.id}-${idx}`}
                  className="flex-shrink-0 shrink-0 whitespace-nowrap flex items-center justify-center px-7 py-3 rounded-xl bg-white border border-gray-200/80 shadow-sm min-w-[170px] md:min-w-[210px] h-[76px] md:h-[84px]"
                >
                  <DeveloperLogo id={dev.id} className="h-9 md:h-11" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: LEFT -> RIGHT (32s linear infinite, 8 unique logos) */}
        <div className="ticker-viewport" style={{ overflow: 'hidden', width: '100%' }}>
          <div
            className="ticker-track ticker-right"
            style={{
              display: 'flex',
              width: 'max-content',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              animation: 'ticker-right 32s linear infinite',
            }}
          >
            {/* LOGO SET */}
            <div
              className="logo-set"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: '1.5rem', paddingRight: '1.5rem' }}
            >
              {row2Logos.map((dev, idx) => (
                <div
                  key={`r2-s1-${dev.id}-${idx}`}
                  className="flex-shrink-0 shrink-0 whitespace-nowrap flex items-center justify-center px-7 py-3 rounded-xl bg-white border border-gray-200/80 shadow-sm min-w-[170px] md:min-w-[210px] h-[76px] md:h-[84px]"
                >
                  <DeveloperLogo id={dev.id} className="h-9 md:h-11" />
                </div>
              ))}
            </div>

            {/* IDENTICAL LOGO SET DUPLICATE */}
            <div
              className="logo-set"
              aria-hidden="true"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: '1.5rem', paddingRight: '1.5rem' }}
            >
              {row2Logos.map((dev, idx) => (
                <div
                  key={`r2-s2-${dev.id}-${idx}`}
                  className="flex-shrink-0 shrink-0 whitespace-nowrap flex items-center justify-center px-7 py-3 rounded-xl bg-white border border-gray-200/80 shadow-sm min-w-[170px] md:min-w-[210px] h-[76px] md:h-[84px]"
                >
                  <DeveloperLogo id={dev.id} className="h-9 md:h-11" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: RIGHT -> LEFT (30s linear infinite, 8 unique logos) */}
        <div className="ticker-viewport" style={{ overflow: 'hidden', width: '100%' }}>
          <div
            className="ticker-track ticker-left-2"
            style={{
              display: 'flex',
              width: 'max-content',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              animation: 'ticker-left 30s linear infinite',
            }}
          >
            {/* LOGO SET */}
            <div
              className="logo-set"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: '1.5rem', paddingRight: '1.5rem' }}
            >
              {row3Logos.map((dev, idx) => (
                <div
                  key={`r3-s1-${dev.id}-${idx}`}
                  className="flex-shrink-0 shrink-0 whitespace-nowrap flex items-center justify-center px-7 py-3 rounded-xl bg-white border border-gray-200/80 shadow-sm min-w-[170px] md:min-w-[210px] h-[76px] md:h-[84px]"
                >
                  <DeveloperLogo id={dev.id} className="h-9 md:h-11" />
                </div>
              ))}
            </div>

            {/* IDENTICAL LOGO SET DUPLICATE */}
            <div
              className="logo-set"
              aria-hidden="true"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', gap: '1.5rem', paddingRight: '1.5rem' }}
            >
              {row3Logos.map((dev, idx) => (
                <div
                  key={`r3-s2-${dev.id}-${idx}`}
                  className="flex-shrink-0 shrink-0 whitespace-nowrap flex items-center justify-center px-7 py-3 rounded-xl bg-white border border-gray-200/80 shadow-sm min-w-[170px] md:min-w-[210px] h-[76px] md:h-[84px]"
                >
                  <DeveloperLogo id={dev.id} className="h-9 md:h-11" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
