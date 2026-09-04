import React from 'react';
import { Shield, Lock, EyeOff, FileText, CheckCircle2, ArrowLeft, ArrowUpRight, Building2 } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy') => void;
  onOpenConsultation: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <div className="w-full pt-28 pb-24 bg-brand-warmWhite text-brand-dark min-h-screen">
      {/* Hero Header */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12">
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6 animate-fadeIn">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-brand-purple transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Privacy Policy</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
              LEGAL & GOVERNANCE
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 mb-4 leading-tight">
              Privacy & Discretion Policy.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
              At Aurex Estates, client confidentiality is a non-negotiable cornerstone of strategic real estate advisory. We safeguard your personal and financial discretion with institutional integrity.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-medium">
                <Shield className="w-3.5 h-3.5" />
                Active Corporate Protocol • 2026
              </span>
              <span>•</span>
              <span>DLF Corporate Greens, Gurugram</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-20">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Summary Navigation Sticky Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              <div className="luxury-card bg-white rounded-2xl p-7 border border-gray-200/80 shadow-md">
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-950 font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-purple" />
                  <span>Policy Overview</span>
                </h3>
                <nav className="space-y-2.5 text-xs text-gray-600 font-medium">
                  <a href="#fiduciary" className="block py-1 hover:text-brand-purple transition-colors">
                    1. Fiduciary Commitment
                  </a>
                  <a href="#collection" className="block py-1 hover:text-brand-purple transition-colors">
                    2. Information Collection
                  </a>
                  <a href="#no-spam" className="block py-1 hover:text-brand-purple transition-colors">
                    3. Zero Third-Party Resale Guarantee
                  </a>
                  <a href="#usage" className="block py-1 hover:text-brand-purple transition-colors">
                    4. Strategic Use of Information
                  </a>
                  <a href="#security" className="block py-1 hover:text-brand-purple transition-colors">
                    5. Security & Confidentiality
                  </a>
                  <a href="#rights" className="block py-1 hover:text-brand-purple transition-colors">
                    6. Client Rights & Retention
                  </a>
                  <a href="#governance" className="block py-1 hover:text-brand-purple transition-colors">
                    7. Corporate Legal Contact
                  </a>
                </nav>
              </div>

              {/* Consultation Quick Card */}
              <div className="bg-brand-warmWhite rounded-2xl p-7 border border-gray-200/80">
                <h4 className="text-sm font-semibold text-gray-950 mb-2">Have specific compliance questions?</h4>
                <p className="text-xs text-gray-600 font-light mb-5 leading-relaxed">
                  Our advisory partners operate under strict NDA protocols upon request for high-ticket portfolio mandates.
                </p>
                <button
                  onClick={onOpenConsultation}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold shadow-md shadow-brand-purple/20 transition-all"
                >
                  <span>Request Private Briefing</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Detailed Clauses */}
            <div className="lg:col-span-8 space-y-10">
              {/* Clause 1 */}
              <div id="fiduciary" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-5">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  1. Fiduciary Commitment & Strategic Discretion
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-4">
                  Aurex Estates operates as an elite real estate advisory practice serving high-net-worth individuals, institutional investors, family offices, and discerning end-user homeowners.
                </p>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                  We recognize that acquisitions, portfolio reviews, and capital allocations in Delhi NCR real estate represent confidential commercial and personal decisions. Every engagement is treated under strict fiduciary privilege.
                </p>
              </div>

              {/* Clause 2 */}
              <div id="collection" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-5">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  2. Information We Collect
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-4">
                  We only gather information voluntarily furnished by you during consultation requests, advisory questionnaires, or direct dialogue with our partners:
                </p>
                <ul className="space-y-2.5 text-sm text-gray-600 font-light">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                    <span><strong>Identity Details:</strong> Full name, professional designation, and corporate affiliation where relevant.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                    <span><strong>Contact Coordinates:</strong> Verified telephone number, corporate or personal email address, and preferred consultation schedule.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                    <span><strong>Advisory Criteria:</strong> Specific asset preferences, target corridors (e.g., Golf Course Road, SPR, Dwarka Expressway), allocation horizons, and timeline expectations.</span>
                  </li>
                </ul>
              </div>

              {/* Clause 3 */}
              <div id="no-spam" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm bg-gradient-to-br from-white via-white to-brand-warmWhite">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-5">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  3. Zero Third-Party Resale & No-Spam Guarantee
                </h2>
                <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/15 text-gray-900 text-sm mb-4 leading-relaxed font-medium">
                  We maintain a strict zero-tolerance policy toward property broker spam and mass data distribution.
                </div>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-3">
                  Unlike conventional property portals or channel brokers who broadcast client phone numbers across hundreds of third-party agents, <strong>Aurex Estates will NEVER sell, lease, rent, trade, or distribute your private contact details to external marketing agencies or bulk broker syndicates</strong>.
                </p>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                  Your communication channel remains exclusively between you and your appointed Aurex Estates advisory team.
                </p>
              </div>

              {/* Clause 4 */}
              <div id="usage" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  4. Strategic Use of Information
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-4">
                  Information collected is utilized exclusively for genuine advisory workflows:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-semibold text-gray-950 block mb-1">Consultation Scheduling</span>
                    Facilitating private discussions and coordinating site inspections with developers.
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-semibold text-gray-950 block mb-1">Market Due Diligence</span>
                    Providing customized secondary pricing reports and corridor timeline intelligence.
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-semibold text-gray-950 block mb-1">Mandate Representation</span>
                    Conducting structured negotiations and verifying title and master plan compliance.
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-semibold text-gray-950 block mb-1">Client Fiduciary Updates</span>
                    Delivering milestone progress reports throughout the acquisition or divestment lifecycle.
                  </div>
                </div>
              </div>

              {/* Clause 5 */}
              <div id="security" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  5. Security & Confidential Storage
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-3">
                  We deploy institutional-grade technical, cryptographic, and organizational safeguards to ensure data security. Digital submissions are transmitted across encrypted SSL protocols (TLS 1.3).
                </p>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                  Access to client records is strictly restricted on a need-to-know basis to accredited advisory directors bound by non-disclosure covenants.
                </p>
              </div>

              {/* Clause 6 */}
              <div id="rights" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  6. Client Rights & Data Retention
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-3">
                  You retain full authority over your data. You may at any point request:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600 font-light mb-4">
                  <li>A full review of personal records held in connection with your advisory mandate.</li>
                  <li>Rectification or updates to your contact preferences.</li>
                  <li>Immediate purging or deletion of your consultation files from active CRM records, subject only to statutory regulatory retention laws.</li>
                </ul>
              </div>

              {/* Clause 7: Corporate Governance */}
              <div id="governance" className="luxury-card bg-white rounded-2xl p-8 sm:p-10 border border-gray-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-5">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight">
                  7. Corporate Legal Desk & Enquiries
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-6">
                  For formal inquiries regarding our data protection protocol or to exercise your rights under this policy, contact our compliance desk directly:
                </p>

                <div className="p-6 rounded-2xl bg-brand-warmWhite border border-gray-200 space-y-3 text-sm text-gray-800">
                  <p className="font-semibold text-gray-950">AUREX ESTATES — Legal & Governance</p>
                  <p className="text-gray-600 font-light">
                    1610, 16th Floor, Tower 4, DLF Corporate Greens, Sector 74A,<br />
                    Gurugram, Haryana - 122004, India
                  </p>
                  <div className="pt-2 flex flex-wrap gap-6 text-xs font-medium">
                    <span>Email: <a href="mailto:info@aurexestates.co.in" className="text-brand-purple underline">info@aurexestates.co.in</a></span>
                    <span>Telephone: <a href="tel:+918796791087" className="text-brand-purple underline">+91 87967 91087</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
