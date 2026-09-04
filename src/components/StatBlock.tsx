import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../data/advisory';

export const StatBlock: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-28 bg-white border-y border-gray-150 relative overflow-hidden"
    >
      <div className="max-w-site mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs uppercase tracking-[0.28em] text-brand-purple font-semibold block mb-3">
            PROVEN PERFORMANCE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-950">
            A Track Record That Speaks.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center text-center px-4 ${
                idx > 0 ? 'pt-8 sm:pt-0' : ''
              }`}
            >
              {/* Large Crisp Typography: Black base with single purple accent */}
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-black font-sans mb-3 flex items-baseline justify-center">
                <AnimatedCounter
                  target={stat.number}
                  isVisible={isVisible}
                  duration={1800}
                />
                <span className="text-brand-purple font-normal ml-1 text-4xl sm:text-5xl md:text-6xl">
                  {stat.suffix}
                </span>
              </div>

              {/* Black Text Label */}
              <h3 className="text-sm md:text-base font-semibold tracking-[0.16em] text-gray-900 uppercase mt-1">
                {stat.label}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Smooth Number Counter Subcomponent
const AnimatedCounter: React.FC<{
  target: number;
  isVisible: boolean;
  duration?: number;
}> = ({ target, isVisible, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      // Ease out cubic for silky luxury feel
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easeOut * target));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, target, duration]);

  return <span>{count}</span>;
};
