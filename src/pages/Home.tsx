import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  Home as HomeIcon,
  Compass,
  ShieldCheck,
  Eye,
  Sparkles,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../data/images';
import { CORRIDORS } from '../data/corridors';
import { VALUES } from '../data/advisory';
import { LogoTicker } from '../components/LogoTicker';
import { StatBlock } from '../components/StatBlock';
import { TestimonialCarousel } from '../components/TestimonialCarousel';

interface HomeProps {
  onOpenConsultation: (category?: string) => void;
  onNavigate: (page: 'home' | 'about' | 'contact' | 'privacy') => void;
}

// Reusable Framer Motion Variants
const fadeInUp = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

// Hero Background Image Crossfade Variants (1.2s easeInOut)
const heroBackgroundVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeInOut' as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1.2,
      ease: 'easeInOut' as const,
    },
  },
};

export const Home: React.FC<HomeProps> = ({ onOpenConsultation, onNavigate: _onNavigate }) => {
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Advisory Process Mobile Carousel State
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Different By Design Mobile Swipe Scroll State
  const differentScrollRef = useRef<HTMLDivElement>(null);
  const [activeDifferentIndex, setActiveDifferentIndex] = useState(0);

  const differentBlocks = [
    {
      title: 'INVESTORS',
      category: 'Investment Advisory',
      eyebrow: 'PORTFOLIO ALLOCATION',
      quote: '“Evaluate opportunities with a longer-term perspective.”',
      icon: TrendingUp,
      image: '/images/cyber-city.jpg',
      alt: 'Prime commercial investment assets Cyber City Gurugram',
    },
    {
      title: 'END USERS',
      category: 'End-User Advisory',
      eyebrow: 'LUXURY RESIDENCES',
      quote: '“Find a home that fits your life and future.”',
      icon: HomeIcon,
      image: '/images/penthouse-interior.jpg',
      alt: 'Luxury penthouse interior architecture Delhi NCR',
    },
    {
      title: 'ADVISORY',
      category: 'Strategic Advisory',
      eyebrow: 'DECISION SUPPORT',
      quote: '“Make important property decisions with greater clarity.”',
      icon: Compass,
      image: '/images/dlf-corporate-greens.jpg',
      alt: 'Strategic real estate corporate advisory Gurugram',
    },
  ];

  const handleDifferentScroll = () => {
    if (!differentScrollRef.current) return;
    const { scrollLeft, clientWidth } = differentScrollRef.current;
    const cardWidth = clientWidth * 0.84 + 16;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveDifferentIndex(Math.min(Math.max(newIndex, 0), differentBlocks.length - 1));
  };

  const scrollToDifferentCard = (idx: number) => {
    if (!differentScrollRef.current) return;
    const cardWidth = differentScrollRef.current.clientWidth * 0.84 + 16;
    differentScrollRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth',
    });
    setActiveDifferentIndex(idx);
  };

  const scrollDifferentPrev = () => {
    scrollToDifferentCard(Math.max(activeDifferentIndex - 1, 0));
  };

  const scrollDifferentNext = () => {
    scrollToDifferentCard(Math.min(activeDifferentIndex + 1, differentBlocks.length - 1));
  };

  const advisorySteps = [
    {
      step: '01',
      title: 'UNDERSTAND',
      desc: 'Consultation to define your capital and living objectives.',
      image: '/images/process/advisory-understand.jpg',
      alt: 'Senior Indian luxury real estate advisor consulting with client in Gurugram boardroom',
    },
    {
      step: '02',
      title: 'EVALUATE',
      desc: 'Rigorous evaluation of market opportunities and developer track records.',
      image: '/images/process/advisory-evaluate.jpg',
      alt: 'Indian real estate investment director evaluating luxury high-rise architectural scale model',
    },
    {
      step: '03',
      title: 'COMPARE',
      desc: 'Detailed comparative analysis of floor plans, pricing metrics, and yields.',
      image: '/images/process/advisory-compare.jpg',
      alt: 'Indian real estate portfolio strategist comparing market yields with clients',
    },
    {
      step: '04',
      title: 'EXECUTE',
      desc: 'Transparent negotiation, deed verification, and closing management.',
      image: '/images/process/advisory-execute.jpg',
      alt: 'Indian advisor and client executing luxury penthouse closing agreement in Gurugram',
    },
  ];

  const handleProcessTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleProcessTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      // Swiped Left -> Next step
      setActiveProcessStep((prev) => (prev + 1) % advisorySteps.length);
    } else if (diff < -40) {
      // Swiped Right -> Previous step
      setActiveProcessStep((prev) => (prev - 1 + advisorySteps.length) % advisorySteps.length);
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.heroSlides.length);
    }, 6000); // 6s smooth rotation
    return () => clearInterval(timer);
  }, [currentSlide]);



  return (
    <div className="w-full bg-white text-brand-dark">
      {/* =========================================================================
          SECTION 1 — HERO
          Cinematic full-width hero banner with slow zoom/parallax, automatic
          image-changing carousel across asset categories.
      ========================================================================= */}
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden flex items-center justify-center bg-black">
        {/* Background Slides with AnimatePresence Smooth Crossfade & Continuous Ken Burns Zoom */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            variants={heroBackgroundVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 z-0 overflow-hidden"
          >
            {/* Continuous subtle slow zoom/scale effect from 1.05 to 1.15 over the 6s slide duration */}
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.15 }}
              transition={{ duration: 6, ease: 'easeOut' as const }}
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${IMAGES.heroSlides[currentSlide].url})` }}
              aria-label={IMAGES.heroSlides[currentSlide].alt}
            />

            {/* Cinematic Gradient Overlays for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Central Content Area with Staggered Framer Motion Reveal */}
        <div className="relative z-20 w-full max-w-site mx-auto px-6 md:px-12 py-24 flex flex-col justify-center h-full">
          <div className="max-w-3xl text-left">


            {/* 2. Hero Headline (delay: 0.3s) */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-white leading-[1.14] mb-6 text-shadow-subtle"
            >
              Real Estate Decisions,<br />
              <span className="text-white">
                Built Around Your Growth.
              </span>
            </motion.h1>

            {/* 3. Supporting Text (delay: 0.45s) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-2xl mb-10"
            >
              Strategic real estate advisory for investors and end users across Delhi NCR.
            </motion.p>

            {/* 4. CTAs (delay: 0.6s) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <button
                onClick={() => onOpenConsultation()}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.2em] font-semibold shadow-2xl shadow-brand-purple/40 hover:shadow-brand-purple/60 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>


            </motion.div>
          </div>

          {/* 5. Smooth Dot Navigation Transitions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="absolute bottom-12 left-6 md:left-12 flex items-center gap-3 z-30"
          >
            {IMAGES.heroSlides.map((slide, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Switch to slide ${idx + 1}: ${slide.caption}`}
                animate={{
                  width: currentSlide === idx ? 40 : 12,
                  backgroundColor: currentSlide === idx ? '#8B2BE2' : 'rgba(255, 255, 255, 0.4)',
                }}
                whileHover={{
                  backgroundColor: currentSlide === idx ? '#8B2BE2' : 'rgba(255, 255, 255, 0.8)',
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' as const }}
                className="h-1.5 rounded-full shadow-sm"
              />
            ))}
          </motion.div>


        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — DEVELOPER NETWORK (Light Theme 3-Row Ticker Flow)
          Three continuous opposing logo ticker rows with 24 verified developers
      ========================================================================= */}
      <LogoTicker />

      {/* =========================================================================
          SECTION 3 — PROOF (Track Record & Statistics)
          A Track Record That Speaks with 3 animated counters
      ========================================================================= */}
      <StatBlock />

      {/* =========================================================================
          THE ADVISORY PROCESS (Positioned below the word counter container)
          Animated process: 01 UNDERSTAND, 02 EVALUATE, 03 COMPARE, 04 EXECUTE
      ========================================================================= */}
      <section id="advisory-process" className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-20 md:pb-24 lg:pb-28 bg-brand-warmWhite text-brand-dark relative">
        <div className="max-w-site mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
              THE ADVISORY PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-950 mb-4">
              Clarity Before Commitment.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-light">
              A structured, analytical protocol designed to remove bias and protect your interests.
            </p>
          </motion.div>

          {/* ==================== DESKTOP VIEW (>= md) ==================== */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8 relative">
            {advisorySteps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="luxury-card relative z-10 bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm group flex flex-col"
              >
                {/* Dedicated Realistic Image Header */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Floating Step Badge */}
                  <div className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-brand-purple text-white font-semibold text-xs flex items-center justify-center shadow-md shadow-brand-purple/30 group-hover:scale-105 transition-transform duration-300">
                    {item.step}
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold tracking-wider text-gray-950 mb-1.5 uppercase group-hover:text-brand-purple transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ==================== MOBILE VIEW (< md) ==================== */}
          {/* Elegant full-width swipeable card with dedicated realistic image and subtle angle brackets */}
          <div className="md:hidden">
            {/* Step Selection Pills with Smooth Travel Pill Animation */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {advisorySteps.map((item, idx) => (
                <button
                  key={item.step}
                  onClick={() => setActiveProcessStep(idx)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold select-none transition-colors duration-200 ${
                    activeProcessStep === idx
                      ? 'text-white shadow-md shadow-brand-purple/25'
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-brand-purple'
                  }`}
                >
                  {activeProcessStep === idx && (
                    <motion.div
                      layoutId="activeProcessStepPill"
                      className="absolute inset-0 bg-brand-purple rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Step {item.step}</span>
                </button>
              ))}
            </div>

            {/* Active Swipeable Card Container */}
            <div
              onTouchStart={handleProcessTouchStart}
              onTouchEnd={handleProcessTouchEnd}
              className="relative touch-pan-y"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProcessStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-lg text-center relative flex flex-col"
                >
                  {/* Dedicated Realistic Image Header */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={advisorySteps[activeProcessStep].image}
                      alt={advisorySteps[activeProcessStep].alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating Step Badge */}
                    <div className="absolute top-3.5 left-3.5 w-10 h-10 rounded-full bg-brand-purple text-white font-semibold text-xs flex items-center justify-center shadow-md shadow-brand-purple/30">
                      {advisorySteps[activeProcessStep].step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-wider text-gray-950 mb-2 uppercase">
                      {advisorySteps[activeProcessStep].title}
                    </h3>

                    <p className="text-base text-gray-600 font-light max-w-xs mx-auto mb-5">
                      {advisorySteps[activeProcessStep].desc}
                    </p>

                    {/* Subtle Direction Angle Brackets on Left & Right (Not Very Loud) */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 px-1">
                      <button
                        onClick={() =>
                          setActiveProcessStep((prev) => (prev - 1 + advisorySteps.length) % advisorySteps.length)
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-purple/5 transition-all active:scale-90"
                        aria-label="Previous step"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[1.8]" />
                      </button>

                      {/* Subtle Micro Dots Indicator (Muted, Not Loud) */}
                      <div className="flex items-center gap-1.5">
                        {advisorySteps.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              activeProcessStep === i ? 'w-4 bg-brand-purple/70' : 'w-1 bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setActiveProcessStep((prev) => (prev + 1) % advisorySteps.length)
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-purple/5 transition-all active:scale-90"
                        aria-label="Next step"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* End statement */}
          <motion.div
            {...fadeInUp}
            className="mt-10 sm:mt-12 md:mt-14 text-center max-w-xl mx-auto"
          >
            <p className="text-lg md:text-xl font-light text-gray-700 italic">
              “Better advice isn’t about selling more.<br />
              <span className="text-gray-950 font-medium not-italic">It’s about helping you decide better.</span>”
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — BRAND PHILOSOPHY
          Premium split layout with Framer Motion reveal
      ========================================================================= */}
      <section id="philosophy" className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-16 md:pb-24 bg-brand-warmWhite text-brand-dark relative border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block">
                THE AUREX APPROACH
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 leading-[1.15]">
                “The right property is only the beginning.<br />
                <span className="text-brand-purple">The right decision is what matters.</span>”
              </h2>

              <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed pt-2">
                Real estate decisions deserve more than a sales pitch. Aurex Estates brings perspective, transparency and genuine advisory together to help clients move forward with clarity.
              </p>

              {/* Visual Accents (Single Line on all screens) */}
              <div className="pt-4 flex items-center gap-2 sm:gap-4 md:gap-6 text-[10.5px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.22em] font-semibold text-gray-800 whitespace-nowrap">
                <span className="flex items-center gap-1.5 sm:gap-2 hover:text-brand-purple transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  INTEGRITY
                </span>
                <span className="text-gray-300 select-none">•</span>
                <span className="flex items-center gap-1.5 sm:gap-2 hover:text-brand-purple transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  PERSPECTIVE
                </span>
                <span className="text-gray-300 select-none">•</span>
                <span className="flex items-center gap-1.5 sm:gap-2 hover:text-brand-purple transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  TRUST
                </span>
              </div>
            </motion.div>

            {/* Right Side: Large Luxury Property Image with Framer Motion Reveal */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div
                onClick={() => onOpenConsultation('Luxury Living')}
                className="img-zoom-container relative rounded-2xl shadow-xl group aspect-[4/3] sm:aspect-[16/11] cursor-pointer"
              >
                <img
                  src={IMAGES.philosophy}
                  alt="Modern luxury residential architecture along Golf Course Road Gurugram"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <div className="absolute bottom-5 left-6 right-6 text-white text-xs tracking-wider uppercase font-medium">
                  Golf Course Road • Delhi NCR Landmark Architecture
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — DIFFERENT BY DESIGN
          3 premium icon-led blocks with smooth Framer Motion stagger
      ========================================================================= */}
      <section className="py-12 md:py-18 bg-white text-brand-dark border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.div {...fadeInUp} className="max-w-2xl mb-8 md:mb-12">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
              DIFFERENT BY DESIGN
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-950 mb-4">
              Not Your Average Broker.<br />Your Growth Partner.
            </h2>
            <p className="text-base md:text-lg text-gray-600 font-light">
              We don’t push properties. We understand the decision behind them.
            </p>
          </motion.div>

          {/* ==================== DESKTOP VIEW (>= md) ==================== */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 md:gap-10">
            {differentBlocks.map((block, idx) => {
              const IconComp = block.icon;
              return (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => onOpenConsultation(block.category)}
                  className="luxury-card rounded-2xl bg-brand-warmWhite border border-gray-200/90 overflow-hidden group cursor-pointer flex flex-col shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Relevant Luxury Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={block.image}
                      alt={block.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    
                    {/* Floating Frosted Icon Badge */}
                    <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md text-brand-purple flex items-center justify-center shadow-md group-hover:bg-brand-purple group-hover:text-white transition-all duration-300">
                      <IconComp className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white text-[10px] uppercase tracking-[0.2em] font-semibold">
                      <span>{block.eyebrow}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-950 mb-2 tracking-tight group-hover:text-brand-purple transition-colors">
                        {block.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light leading-relaxed mb-4">
                        {block.quote}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-150 flex items-center justify-between text-xs font-semibold text-brand-purple">
                      <span className="uppercase tracking-wider">Explore Advisory</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ==================== MOBILE VIEW (< md) ==================== */}
          {/* Smooth Swipeable Scroll to Right & Left with relevant images */}
          <div className="md:hidden">
            <div
              ref={differentScrollRef}
              onScroll={handleDifferentScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-6 px-6 pb-4 scrollbar-none scroll-smooth touch-pan-x"
            >
              {differentBlocks.map((block) => {
                const IconComp = block.icon;
                return (
                  <div
                    key={block.title}
                    onClick={() => onOpenConsultation(block.category)}
                    className="w-[84vw] sm:w-[330px] shrink-0 snap-center rounded-2xl bg-brand-warmWhite border border-gray-200/90 overflow-hidden group active:scale-[0.99] transition-transform shadow-md flex flex-col"
                  >
                    {/* Relevant Image Banner */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={block.image}
                        alt={block.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      
                      {/* Floating Frosted Icon Badge */}
                      <div className="absolute top-3.5 left-3.5 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md text-brand-purple flex items-center justify-center shadow-md">
                        <IconComp className="w-5 h-5 stroke-[1.8]" />
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white text-[10px] uppercase tracking-[0.18em] font-semibold">
                        <span>{block.eyebrow}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-950 mb-1.5 tracking-tight">
                          {block.title}
                        </h3>
                        <p className="text-gray-600 text-sm font-light leading-relaxed mb-4">
                          {block.quote}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-150 flex items-center justify-between text-xs font-semibold text-brand-purple">
                        <span className="uppercase tracking-wider">Explore Advisory</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Swipe Navigation Controls & Pagination Indicators */}
            <div className="flex items-center justify-between mt-3 px-1">
              {/* Pagination Dots with Smooth Indicator */}
              <div className="flex items-center gap-2">
                {differentBlocks.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToDifferentCard(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeDifferentIndex === idx
                        ? 'w-7 bg-brand-purple shadow-sm shadow-brand-purple/30'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
                <span className="text-[11px] font-medium text-gray-400 ml-1">
                  {activeDifferentIndex + 1} / {differentBlocks.length}
                </span>
              </div>

              {/* Right & Left Smooth Scroll Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollDifferentPrev}
                  disabled={activeDifferentIndex === 0}
                  aria-label="Scroll to previous card"
                  className={`w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 shadow-sm active:scale-95 transition-all ${
                    activeDifferentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-brand-purple hover:text-brand-purple'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollDifferentNext}
                  disabled={activeDifferentIndex === differentBlocks.length - 1}
                  aria-label="Scroll to next card"
                  className={`w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 shadow-sm active:scale-95 transition-all ${
                    activeDifferentIndex === differentBlocks.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-brand-purple hover:text-brand-purple'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — GUIDING PRINCIPLES (4 Pillars Architecture)
          4 institutional value pillars with Framer Motion staggered reveal
      ========================================================================= */}
      <section className="pt-14 md:pt-18 pb-8 md:pb-12 bg-brand-warmWhite text-brand-dark relative overflow-hidden border-t border-gray-150">
        <div className="max-w-site mx-auto px-6 md:px-12 relative z-10">
          {/* Section Heading with Exact 2-Line Break */}
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
              GUIDING PRINCIPLES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 leading-[1.2]">
              <span className="block">Built on Trust.</span>
              <span className="block mt-1">Defined by How We Work.</span>
            </h2>
          </motion.div>

          {/* 4 Big Value Pillar Boxes (Full-width clean grid with zero text clipping) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {VALUES.map((val, idx) => {
              const IconComponent =
                idx === 0
                  ? ShieldCheck
                  : idx === 1
                  ? Eye
                  : idx === 2
                  ? Sparkles
                  : Users;

              return (
                <motion.div
                  key={val.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="bg-white rounded-2xl p-7 sm:p-8 min-h-[220px] sm:min-h-[240px] md:min-h-[250px] flex flex-col border border-gray-200/90 shadow-sm hover:shadow-2xl hover:shadow-brand-purple/[0.06] transition-all duration-300 group"
                >
                  <div>
                    {/* Header Row: Large Icon Badge & Monospace Index */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/15 text-brand-purple flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-all duration-300 group-hover:scale-105 shadow-sm">
                        <IconComponent className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="text-sm font-mono font-semibold tracking-widest text-gray-400 group-hover:text-brand-purple transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Bold Pillar Title */}
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-950 mb-3 tracking-tight group-hover:text-brand-purple transition-colors duration-200">
                      {val.name}
                    </h3>

                    {/* Simple, Concise Plain Language Description */}
                    <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 7 — REAL ESTATE ASSET CLASSES
          Pure asset categorization: Plot, High Rise Apartment, Low Rise Floors,
          Commercial Investment, Affordable Investment.
          With Framer Motion staggered entrance and instant inquiry form modal.
      ========================================================================= */}
      <section className="py-12 md:py-18 bg-brand-warmWhite text-brand-dark relative">
        <div className="max-w-site mx-auto px-6 md:px-12">
          {/* Editorial Header */}
          <motion.div {...fadeInUp} className="max-w-3xl mb-10 md:mb-14">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
              PROPERTY ASSET CATEGORIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 mb-5 leading-tight">
              Strategic Real Estate Asset Portfolios.
            </h2>
            <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
              Tailored advisory across Delhi NCR’s core property asset classes. Click any asset below to submit your requirements directly to our senior advisory desk.
            </p>
          </motion.div>

          {/* Real Property Asset Classes Grid with Framer Motion Stagger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* 1. High Rise Apartments (Primary 8-col) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onOpenConsultation('High Rise Apartments')}
              className="lg:col-span-8 rounded-2xl overflow-hidden shadow-xl relative group h-[380px] sm:h-[460px] img-zoom-container cursor-pointer"
            >
              <img
                src={IMAGES.assets.highRise}
                alt="High Rise Apartments in Delhi NCR"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/90 transition-all" />

              <div className="absolute bottom-8 left-8 right-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-md">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-purple-300 font-semibold block mb-1">
                    RESIDENTIAL ASSET
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    High Rise Apartments
                  </h3>
                  <p className="text-gray-200 text-xs md:text-sm font-light mt-1">
                    Luxury high-rise condominiums, penthouses, and gated vertical communities across prime corridors.
                  </p>
                </div>

                {/* Form Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenConsultation('High Rise Apartments');
                  }}
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold shadow-lg shadow-brand-purple/40 hover:shadow-brand-purple/60 hover:-translate-y-0.5 transition-all"
                >
                  <span>Enquire</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* 2 & 3: Right Column Stack */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* 2. Low Rise Floors */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onOpenConsultation('Low Rise Floors')}
                className="rounded-2xl overflow-hidden shadow-lg relative group h-[216px] img-zoom-container cursor-pointer"
              >
                <img
                  src={IMAGES.assets.lowRise}
                  alt="Low Rise Floors in Gurugram"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-purple-300 font-semibold block">
                      INDEPENDENT LIVING
                    </span>
                    <h4 className="text-base font-semibold">Low Rise Floors</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenConsultation('Low Rise Floors');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-purple text-white text-[11px] font-semibold uppercase tracking-wider shadow-md hover:bg-brand-purpleDark transition-all"
                  >
                    <span>Enquire</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>

              {/* 3. Plots */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onOpenConsultation('Plots')}
                className="rounded-2xl overflow-hidden shadow-lg relative group h-[216px] img-zoom-container cursor-pointer"
              >
                <img
                  src={IMAGES.assets.plots}
                  alt="Plots in Delhi NCR"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-purple-300 font-semibold block">
                      LAND & TOWNSHIPS
                    </span>
                    <h4 className="text-base font-semibold">Plots</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenConsultation('Plots');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-purple text-white text-[11px] font-semibold uppercase tracking-wider shadow-md hover:bg-brand-purpleDark transition-all"
                  >
                    <span>Enquire</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* 4. Commercial Investment (6-col) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onOpenConsultation('Commercial Investment')}
              className="lg:col-span-6 rounded-2xl overflow-hidden shadow-lg relative group h-[260px] sm:h-[300px] img-zoom-container cursor-pointer"
            >
              <img
                src={IMAGES.assets.commercial}
                alt="Commercial Investment in Gurugram"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-purple-300 font-semibold block mb-0.5">
                    COMMERCIAL ASSET
                  </span>
                  <h4 className="text-xl font-semibold">Commercial Investment</h4>
                  <p className="text-xs text-gray-300 font-light mt-0.5">Grade-A office suites, retail arcades, and pre-leased assets.</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenConsultation('Commercial Investment');
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-all"
                >
                  <span>Enquire</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* 5. Affordable Investment (6-col) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onOpenConsultation('Affordable Investment')}
              className="lg:col-span-6 rounded-2xl overflow-hidden shadow-lg relative group h-[260px] sm:h-[300px] img-zoom-container cursor-pointer"
            >
              <img
                src={IMAGES.assets.affordable}
                alt="Affordable Investment in Delhi NCR"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-purple-300 font-semibold block mb-0.5">
                    STRATEGIC ENTRY
                  </span>
                  <h4 className="text-xl font-semibold">Affordable Investment</h4>
                  <p className="text-xs text-gray-300 font-light mt-0.5">High-yield entry investments in smart planned communities.</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenConsultation('Affordable Investment');
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-all"
                >
                  <span>Enquire</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Location Markers with Smooth Hover Flow */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            {CORRIDORS.map((corridor) => (
              <div
                key={corridor.id}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200/90 shadow-sm text-gray-800 text-xs sm:text-sm font-medium hover:border-brand-purple hover:text-brand-purple hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                <span>{corridor.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* =========================================================================
          SECTION 10 — CLIENT TESTIMONIALS (Real Testimonials with Flow Carousel)
      ========================================================================= */}
      <TestimonialCarousel />

      {/* =========================================================================
          SECTION 11 — FINAL CTA (Light Luxury Frosted Panel with Framer Motion)
      ========================================================================= */}
      <section className="relative py-16 md:py-24 w-full overflow-hidden flex items-center justify-center bg-gray-950">
        {/* Full-width Luxury Property Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.finalCta})` }}
        />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

        {/* Centered Luminous Glassmorphism Panel with Framer Motion Reveal */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 rounded-3xl p-10 sm:p-14 border border-white/80 shadow-2xl backdrop-blur-xl animate-subtle-float"
          >
            <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-4">
              TAKE THE NEXT STEP
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-950 mb-4">
              Let’s Start With a Conversation.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-light mb-8 max-w-md mx-auto leading-relaxed">
              Tell us what you’re looking for. We’ll take it from there.
            </p>
            <div className="flex items-center justify-center">
              <button
                onClick={() => onOpenConsultation()}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-[0.2em] font-semibold shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
