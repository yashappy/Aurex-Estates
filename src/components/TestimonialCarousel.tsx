import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../data/testimonials';

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance every 7.5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const triggerSlideChange = (newIdx: number) => {
    setCurrentIndex(newIdx);
  };

  const prevSlide = () => {
    const prevIdx = (currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    triggerSlideChange(prevIdx);
  };

  const nextSlide = () => {
    const nextIdx = (currentIndex + 1) % TESTIMONIALS.length;
    triggerSlideChange(nextIdx);
  };

  const current = TESTIMONIALS[currentIndex];

  // Derive client initials for a luxury monogram avatar
  const initials = current.clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <section
      className="py-16 md:py-24 bg-white text-brand-dark relative overflow-hidden border-t border-gray-150"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-site mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-950">
            What Our Clients Say.
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base font-light max-w-lg mx-auto mt-2.5">
            Real experiences from investors and families who trusted Aurex Estates as their strategic growth partner.
          </p>
        </motion.div>

        {/* Compact Editorial Carousel Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto bg-brand-warmWhite rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200/90 relative shadow-lg shadow-black/[0.02]"
        >
          {/* Top Context & Quote Row */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] uppercase tracking-wider font-semibold">
              <Sparkles className="w-3 h-3 text-brand-purple" />
              <span>{current.context}</span>
            </div>

            <div className="text-brand-purple/20">
              <Quote className="w-7 h-7 md:w-8 md:h-8 stroke-[1.5]" />
            </div>
          </div>

          {/* Testimonial Quote with Reduced Text Size */}
          <div className="min-h-[90px] sm:min-h-[105px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-sm sm:text-base md:text-[17px] font-normal text-gray-800 leading-relaxed italic text-center sm:text-left"
              >
                “{current.quote}”
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Client Metadata with Compact Monogram Badge & Nav Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              {/* Monogram Badge */}
              <div className="w-10 h-10 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-xs flex items-center justify-center border border-brand-purple/30 shadow-sm shrink-0">
                {initials}
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-950 tracking-wide">
                  {current.clientName}
                </h4>
                <p className="text-[11px] text-brand-purple tracking-wider uppercase font-semibold mt-0.5">
                  {current.designation}
                </p>
                <p className="text-[10px] text-gray-500 font-light mt-0.5">
                  {current.location}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border border-gray-300 hover:border-brand-purple hover:bg-brand-purple hover:text-white flex items-center justify-center text-gray-700 transition-all duration-300 focus:outline-none shadow-sm group"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-gray-300 hover:border-brand-purple hover:bg-brand-purple hover:text-white flex items-center justify-center text-gray-700 transition-all duration-300 focus:outline-none shadow-sm group"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Interactive Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => triggerSlideChange(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-brand-purple shadow-sm'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
