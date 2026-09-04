import React from 'react';
import { MapPin, Phone, Mail, ArrowUpRight, MessageSquare, Clock } from 'lucide-react';
import { IMAGES } from '../data/images';
import { ContactForm } from '../components/ContactForm';

export const Contact: React.FC = () => {
  return (
    <div className="w-full bg-brand-warmWhite min-h-screen">
      {/* Hero Header */}
      <section className="pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14 md:pb-18 text-center">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 mb-4">
            Let’s Start With a Conversation.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-xl mx-auto">
            Tell us what you’re looking for. We’ll take it from there.
          </p>
        </div>
      </section>

      {/* Split Layout Section */}
      <section className="pb-24">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* LEFT: Real Headquarters Building Image & Office Coordinates */}
            <div className="lg:col-span-6 space-y-8">
              {/* Real DLF Corporate Greens Building Showcase */}
              <div className="rounded-2xl overflow-hidden shadow-2xl relative h-[360px] sm:h-[420px] group img-zoom-container bg-gray-100">
                <img
                  src={IMAGES.contactHero}
                  alt="Aurex Estates corporate offices DLF Corporate Greens Sector 74A Gurugram"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-semibold">
                    DLF Corporate Greens, Sector 74A
                  </h3>
                </div>
              </div>

              {/* Physical Coordinates Card */}
              <div className="luxury-card bg-white rounded-2xl p-8 border border-gray-200/80 shadow-lg space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-950 tracking-tight">
                    AUREX ESTATES
                  </h4>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-3.5 text-gray-700 text-sm">
                    <MapPin className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
                    <div className="font-light leading-relaxed">
                      1610, 16th Floor, Tower 4,<br />
                      DLF Corporate Greens, Sector 74A,<br />
                      Gurugram, Haryana - 122004
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 text-gray-700 text-sm">
                    <Phone className="w-4 h-4 text-brand-purple shrink-0" />
                    <a
                      href="tel:+918796791087"
                      className="hover:text-brand-purple font-medium transition-colors"
                    >
                      +91 87967 91087
                    </a>
                  </div>

                  <div className="flex items-center gap-3.5 text-gray-700 text-sm">
                    <Mail className="w-4 h-4 text-brand-purple shrink-0" />
                    <a
                      href="mailto:info@aurexestates.co.in"
                      className="hover:text-brand-purple font-medium transition-colors"
                    >
                      info@aurexestates.co.in
                    </a>
                  </div>

                  {/* Office Timing */}
                  <div className="flex items-center gap-3.5 text-gray-700 text-xs font-medium">
                    <Clock className="w-4 h-4 text-brand-purple shrink-0" />
                    <span>Tuesday – Sunday: 10:00 AM – 6:30 PM</span>
                  </div>
                </div>

                {/* Direct WhatsApp CTA Button */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href="https://wa.me/918796791087"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: Premium Clean Contact Form */}
            <div className="lg:col-span-6">
              <ContactForm source="Contact Page" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
