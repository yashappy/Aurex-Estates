import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Eye,
  HeartHandshake,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { IMAGES } from '../data/images';
import { StatBlock } from '../components/StatBlock';

interface AboutProps {
  onOpenConsultation: () => void;
  onNavigate?: (page: 'home' | 'about' | 'contact' | 'privacy') => void;
}

export const About: React.FC<AboutProps> = ({ onOpenConsultation, onNavigate: _onNavigate }) => {
  const coreValues = [
    {
      name: 'Integrity',
      desc: 'Your interest comes before the transaction.',
      icon: ShieldCheck,
    },
    {
      name: 'Ethics',
      desc: 'Do what is right, not simply what closes.',
      icon: Award,
    },
    {
      name: 'Authenticity',
      desc: 'Genuine advice over exaggerated promises.',
      icon: Sparkles,
    },
    {
      name: 'Transparency',
      desc: 'Clear conversations. No hidden agenda.',
      icon: Eye,
    },
    {
      name: 'Client First',
      desc: 'Fiduciary advocacy at every stage.',
      icon: HeartHandshake,
    },
    {
      name: 'Long-Term Relationships',
      desc: 'Trust that goes beyond the transaction.',
      icon: Users,
    },
  ];

  return (
    <div className="w-full pt-28 bg-white text-brand-dark">
      {/* =========================================================================
          ABOUT HERO SECTION
      ========================================================================= */}
      <section className="py-16 md:py-24 bg-brand-warmWhite text-brand-dark relative">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-4">
              ABOUT AUREX ESTATES
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 leading-[1.1] mb-6">
              Built Around Trust.<br />
              <span className="text-brand-purple">Driven by Perspective.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-800 font-light leading-relaxed mb-6">
              “Aurex Estates was built around a simple belief: better real estate decisions come from better advice.”
            </p>

            <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
              Over 6+ years, our work has been shaped by integrity, transparency, authenticity and long-term relationships.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL ARCHITECTURAL SPLIT
      ========================================================================= */}
      <section className="py-16 md:py-24 bg-white text-brand-dark border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl relative h-[380px] sm:h-[460px] img-zoom-container group">
              <img
                src={IMAGES.aboutHero}
                alt="Curvilinear luxury architecture along Golf Course Extension Road Gurugram"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-75 transition-opacity" />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.24em] text-gray-400 font-semibold block">
                OUR PHILOSOPHY
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-950 tracking-tight leading-tight">
                Not a Property Broker.<br />
                A Strategic Advisory Partner.
              </h2>

              <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                Conventional brokerage focuses on the velocity of deals. Aurex Estates was established to redefine how investors and end users interact with the Delhi NCR luxury market. We analyze asset quality, corridor infrastructure timelines, legal clearances, and market valuations before ever recommending an acquisition.
              </p>

              <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                Whether assessing prime luxury high-rises on Golf Course Road or strategic growth assets across the wider National Capital Region, our guidance remains grounded, unbiased, and exclusively aligned with your capital growth and lifestyle aspirations.
              </p>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-md shadow-brand-purple/25 hover:-translate-y-0.5"
                >
                  <span>Schedule Private Counsel</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Architectural Showcase Duo with Smooth Image Hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 pt-16 border-t border-gray-150">
            <div className="rounded-2xl overflow-hidden shadow-lg relative h-[240px] sm:h-[280px] img-zoom-container group">
              <img
                src={IMAGES.aboutClubhouse}
                alt="Luxury residential clubhouse and pool deck"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-brand-purpleLight font-semibold block mb-0.5">
                  RESIDENTIAL SANCTUARY
                </span>
                <h4 className="text-base font-semibold">Resort-Style Amenities & Clubhouses</h4>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg relative h-[240px] sm:h-[280px] img-zoom-container group">
              <img
                src={IMAGES.aboutCyberCity}
                alt="DLF Cyber City Horizon Centre Gurugram"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-brand-purpleLight font-semibold block mb-0.5">
                  COMMERCIAL CORRIDOR
                </span>
                <h4 className="text-base font-semibold">Institutional Grade Complexes</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MISSION & VISION (Light Luxury Editorial)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-brand-warmWhite text-brand-dark relative border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-4">
                  OUR MISSION
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-950 mb-6 tracking-tight">
                  Purpose in Every Decision
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 font-light leading-relaxed italic">
                  “To make premium real estate decisions clearer, more informed and more aligned with the people making them.”
                </p>
              </div>
              <div className="pt-8 mt-8 border-t border-gray-100 text-xs uppercase tracking-widest text-brand-purple font-medium">
                AUREX MANDATE
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-4">
                  OUR VISION
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-950 mb-6 tracking-tight">
                  Enduring Client Legacy
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 font-light leading-relaxed italic">
                  “To build a respected real estate advisory brand known for integrity, perspective and long-term client relationships.”
                </p>
              </div>
              <div className="pt-8 mt-8 border-t border-gray-100 text-xs uppercase tracking-widest text-brand-purple font-medium">
                LONG-TERM DIRECTION
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VALUES (6 PILLARS)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-white text-brand-dark border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
              WHAT WE STAND FOR
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-950 mb-4">
              Our Core Values.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-light">
              Principles that guide our conversations, advice, and partnerships every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((val) => {
              const IconComp = val.icon;
              return (
                <div
                  key={val.name}
                  className="luxury-card p-8 rounded-2xl bg-brand-warmWhite border border-gray-200/80 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-6 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300 group-hover:scale-105">
                    <IconComp className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-950 mb-2 tracking-tight">
                    {val.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    “{val.desc}”
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          PROOF STATISTICS
      ========================================================================= */}
      <StatBlock />

      {/* =========================================================================
          CLOSING STATEMENT & CTA (Light Luxury Theme)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-brand-warmWhite text-brand-dark text-center relative overflow-hidden border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block">
              THE AUREX COMMITMENT
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-950 leading-relaxed">
              “For us, success is not just a transaction completed.<br />
              <span className="text-brand-purple font-semibold">It is a relationship earned.</span>”
            </p>

            <div className="pt-8 flex items-center justify-center">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.2em] font-semibold shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50 transition-all hover:-translate-y-0.5"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
