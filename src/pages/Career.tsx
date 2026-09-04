import React from 'react';
import {
  Briefcase,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface CareerProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy' | 'career') => void;
  onOpenConsultation: () => void;
}

export const Career: React.FC<CareerProps> = ({ onNavigate, onOpenConsultation: _onOpenConsultation }) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Trust & Transparency',
      desc: 'We put our clients first. No aggressive sales pressure—just honest, reliable guidance on every decision.',
    },
    {
      icon: TrendingUp,
      title: 'Deep Market Knowledge',
      desc: 'Learn and work with real data, accurate pricing, and deep insights across Gurgaon and Delhi NCR.',
    },
    {
      icon: Award,
      title: 'Growth Based on Merit',
      desc: 'Clear progression where your dedication, ethics, and results are genuinely rewarded.',
    },
  ];

  return (
    <div className="w-full pt-28 pb-20 bg-brand-warmWhite min-h-screen">
      {/* Back to Home */}
      <div className="max-w-site mx-auto px-6 md:px-12 pt-4 pb-2">
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-brand-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Header - Simple, clean, grounded */}
      <section className="pt-6 pb-10 text-center">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-purple font-bold block mb-3">
            CAREERS AT AUREX ESTATES
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mb-4 max-w-2xl mx-auto leading-snug">
            Build Your Career at Aurex Estates.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light max-w-lg mx-auto leading-relaxed">
            We value trust, transparency, and client care. If you do too, we would love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-site mx-auto px-6 md:px-12 space-y-14 lg:space-y-18">
        {/* CURRENT OPENINGS CARD */}
        <section className="max-w-3xl mx-auto w-full">
          <div className="luxury-card bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/90 shadow-xl relative overflow-hidden text-center">
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

            {/* Icon Header */}
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Briefcase className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-3 tracking-tight">
              Current Openings
            </h2>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs sm:text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>There is no current opening</span>
            </div>

            {/* Contact / Resume Submission Box - Unbolded Prompt */}
            <div className="bg-gradient-to-br from-white to-[#F6F5F9] border-2 border-brand-purple/20 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto mb-8 shadow-md text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple mb-2.5">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span>Submit Your Profile For Future Opportunities</span>
              </div>
              
              <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed mb-4">
                Send your updated CV along with a brief note outlining your expertise across Delhi NCR real estate corridors:
              </p>

              <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-gray-200/90 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block">
                    Careers Email
                  </span>
                  <a
                    href="mailto:info@aurexestates.co.in?subject=Career%20Profile%20Submission%20-%20Aurex%20Estates"
                    className="text-base sm:text-lg font-bold text-brand-purple hover:underline truncate block"
                  >
                    info@aurexestates.co.in
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@aurexestates.co.in?subject=Career%20Inquiry%20-%20Aurex%20Estates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.18em] font-bold shadow-lg shadow-brand-purple/25 hover:shadow-brand-purple/40 transition-all duration-300"
              >
                <span>Email Your Resume</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/918796791087?text=Hi%20Aurex%20Estates%20team,%20I%20would%20like%20to%20introduce%20myself%20for%20future%20career%20opportunities."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300"
              >
                <span>WhatsApp HR</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              </a>
            </div>
          </div>
        </section>

        {/* WHY AUREX ESTATES (Culture & Value Pillars - Simplified) */}
        <section className="pt-2 pb-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-brand-purple font-semibold block mb-3">
              OUR WORK CULTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950">
              Why Work With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="luxury-card bg-white rounded-2xl p-8 border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
