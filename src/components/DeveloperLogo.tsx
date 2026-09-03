import React from 'react';

interface DeveloperLogoProps {
  id: string;
  className?: string;
}

export const DeveloperLogo: React.FC<DeveloperLogoProps> = ({ id, className = "h-8 md:h-9" }) => {
  switch (id) {
    case 'max':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/max-estates.png"
            alt="Max Estates"
            className="h-full w-auto max-h-12 md:max-h-14 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'sobha':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/sobha.png"
            alt="SOBHA Realty"
            className="h-full w-auto max-h-12 md:max-h-14 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'adani':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/adani.png"
            alt="Adani Realty"
            className="h-full w-auto max-h-11 md:max-h-13 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'dlf':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/dlf.png"
            alt="DLF Building India"
            className="h-full w-auto max-h-7 md:max-h-8 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'godrej':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/godrej.png"
            alt="Godrej Properties"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'emaar':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/emaar.png"
            alt="Emaar"
            className="h-full w-auto max-h-11 md:max-h-13 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'tata':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/tata.png"
            alt="Tata Housing"
            className="h-full w-auto max-h-7 md:max-h-8 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'oberoi':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/oberoi.png"
            alt="Oberoi Realty"
            className="h-full w-auto max-h-11 md:max-h-13 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'birla':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/birla.png"
            alt="Birla Estates"
            className="h-full w-auto max-h-12 md:max-h-14 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'hero':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/hero.png"
            alt="Hero Homes"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'puri':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/puri.png"
            alt="Puri Constructions"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'centralpark':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/centralpark.png"
            alt="Central Park"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'm3m':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/m3m.png"
            alt="M3M Our Expertise Your Joy"
            className="h-full w-auto max-h-7 md:max-h-8 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'signature':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/signature.png"
            alt="Signature Global"
            className="h-full w-auto max-h-9 md:max-h-10 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'mahindra':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/mahindra.png"
            alt="Mahindra Lifespaces"
            className="h-full w-auto max-h-6 md:max-h-7 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'ireo':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/ireo.png"
            alt="IREO"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'bptp':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/bptp.png"
            alt="BPTP Realty"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'ganga':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/ganga.png"
            alt="Ganga Realty"
            className="h-full w-auto max-h-7 md:max-h-8 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'elan':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/elan.png"
            alt="Elan Group"
            className="h-full w-auto max-h-11 md:max-h-13 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'trehan':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <span className="w-5 h-5 rounded-sm bg-gray-800 text-white flex items-center justify-center font-bold text-xs">T</span>
          <span className="font-bold text-xs md:text-sm tracking-[0.22em] text-gray-950 uppercase">TREHAN</span>
        </div>
      );

    case 'wal':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/wal.png"
            alt="WAL Developers"
            className="h-full w-auto max-h-9 md:max-h-10 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'ats':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/ats.png"
            alt="ATS HomeKraft"
            className="h-full w-auto max-h-11 md:max-h-13 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'pareena':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/pareena.png"
            alt="Pareena Infrastructure"
            className="h-full w-auto max-h-15 md:max-h-16 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'aipl':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/aipl.png"
            alt="AIPL"
            className="h-full w-auto max-h-11 md:max-h-13 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    case 'smartworld':
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src="/images/developers/smartworld.png"
            alt="Smart World Developers"
            className="h-full w-auto max-h-8 md:max-h-9 object-contain filter hover:scale-105 transition-all duration-300"
          />
        </div>
      );

    default:
      return (
        <span className="font-bold text-sm tracking-widest text-gray-800 uppercase">{id}</span>
      );
  }
};
