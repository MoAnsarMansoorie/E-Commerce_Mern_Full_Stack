import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets.js';

const slides = [
  {
    id: 1,
    img: assets.layout1,
    subtitle: 'OUR BESTSELLERS',
    title: 'Latest Arrivals',
    cta: 'SHOP NOW',
  },
  {
    id: 2,
    img: assets.layout2,
    subtitle: 'NEW COLLECTION',
    title: 'Summer Essentials',
    cta: 'EXPLORE',
  },
  {
    id: 3,
    img: assets.layout3,
    subtitle: 'LIMITED EDITION',
    title: 'Handpicked Styles',
    cta: 'DISCOVER',
  },
  {
    id: 4,
    img: assets.layout4,
    subtitle: 'LIMITED EDITION',
    title: 'Handpicked Styles',
    cta: 'DISCOVER',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef(null);
  const slideCount = slides.length;
  const delay = 3000; // 3 seconds
  const displaySlides = [...slides, slides[0]];

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrent((prev) => prev + 1);
    }, delay);

    return () => clearInterval(timerRef.current);
  }, [isPaused, slideCount]);

  const goTo = (index) => {
    setIsTransitioning(true);
    setCurrent(index % slideCount);
  };

  const prev = () => {
    setIsTransitioning(true);
    setCurrent((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
  };

  const next = () => {
    setIsTransitioning(true);
    setCurrent((prevIndex) => prevIndex + 1);
  };

  const handleTransitionEnd = () => {
    if (current === slideCount) {
      setIsTransitioning(false);
      setCurrent(0);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const id = requestAnimationFrame(() => setIsTransitioning(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isTransitioning]);

  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Slides container */}
      <div
        className={`flex w-full ${
          isTransitioning ? 'transition-transform duration-1000 ease-[cubic-bezier(0.45,0,0.2,1)]' : ''
        }`}
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {displaySlides.map((s, index) => (
          <div key={`${s.id}-${index}`} className="min-w-full relative bg-[#f8f7f4] overflow-hidden">
            <img
              src={s.img}
              alt={s.title}
              className="w-full h-screen object-cover text-white transition-transform duration-[3000ms] ease-out"
              style={{ transform: index === current ? 'scale(1.04)' : 'scale(1)' }}
            />

            {/* Overlay text (centered inside page max-width) */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8">
                <div className="max-w-xl px-6 sm:px-12 md:px-20 text-[#414141]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 md:w-11 h-[2px] bg-[#414141] block" />
                    <p className="font-medium text-sm md:text-base text-white">{s.subtitle}</p>
                  </div>

                  <h2 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed text-white">{s.title}</h2>

                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm md:text-base text-white">{s.cta}</p>
                    <span className="w-8 md:w-11 h-[2px] bg-[#414141] block" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next controls */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow hover:bg-white"
      >
        ‹
      </button>

      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow hover:bg-white"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2 w-8 rounded-full transition-all ${
              idx === current % slideCount ? 'bg-[#414141] w-8' : 'bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
