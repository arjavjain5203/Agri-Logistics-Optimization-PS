import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { heroImages } from '../data/heroImages';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const HeroCarousel = () => {
  const { language } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const totalSlides = heroImages.length;

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused, activeSlide]);

  return (
    <div className="relative">
      {/* Bauhaus Geometric Offset Background Accents */}
      <div className="absolute -top-3 -right-3 w-16 h-16 bg-gold border-3 border-charcoal z-0" />
      <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-crop border-3 border-charcoal z-0" />

      {/* Main Carousel Frame */}
      <div
        className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/10] border-4 border-charcoal shadow-bauhaus-lg bg-cream select-none overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="KrishiFlow Agricultural Journey Carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        {heroImages.map((slide, index) => {
          const isActive = index === activeSlide;
          const altText = language === 'hi' ? slide.altHindi : slide.alt;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={altText}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Bauhaus Editorial Corner Tag */}
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-white border-2 border-charcoal px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal shadow-bauhaus-sm">
                  {language === 'hi' ? slide.tagHindi : slide.tag}
                </div>
              </div>

              {/* Bauhaus Slide Counter */}
              <div className="absolute top-4 right-4 z-20">
                <div
                  style={{ backgroundColor: '#EAB308', color: '#172016' }}
                  className="bg-gold border-2 border-charcoal px-2.5 py-0.5 text-xs font-black font-mono text-charcoal shadow-bauhaus-sm"
                >
                  0{index + 1} / 0{totalSlides}
                </div>
              </div>

              {/* Floating Bottom Bauhaus Caption Block */}
              <div className="absolute bottom-4 left-4 right-20 sm:bottom-5 sm:left-5 sm:right-28 z-20">
                <div
                  style={{ backgroundColor: '#FFFFFF', color: '#172016' }}
                  className="inline-block bg-white border-3 border-charcoal p-3 shadow-bauhaus-md max-w-md"
                >
                  <p className="text-charcoal text-sm sm:text-lg font-black uppercase tracking-tight leading-tight">
                    {language === 'hi'
                      ? heroImages[activeSlide].titleHindi
                      : heroImages[activeSlide].title}
                  </p>
                  <p className="text-charcoal/80 text-xs mt-0.5 font-medium line-clamp-1">
                    {language === 'hi'
                      ? heroImages[activeSlide].subtitleHindi
                      : heroImages[activeSlide].subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bauhaus Indicator Buttons (Bottom Right) */}
        <div
          className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-30 flex items-center gap-1.5 bg-white border-2 border-charcoal p-1.5 shadow-bauhaus-sm"
          role="tablist"
          aria-label="Slide indicators"
        >
          {heroImages.map((_, index) => {
            const isActive = index === activeSlide;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                style={isActive ? { backgroundColor: '#EAB308' } : { backgroundColor: '#F7F4EA' }}
                className={`h-4 border-2 border-charcoal transition-all ${
                  isActive
                    ? 'w-7 bg-gold shadow-bauhaus-sm'
                    : 'w-4 bg-cream hover:bg-gold/60'
                }`}
              />
            );
          })}
        </div>

        {/* Mechanical Next Arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute top-1/2 -translate-y-1/2 right-3 z-30 w-8 h-8 bg-white hover:bg-gold border-2 border-charcoal shadow-bauhaus-sm flex items-center justify-center transition-transform active:translate-x-[2px] active:translate-y-[2px]"
        >
          <ChevronRight className="w-4 h-4 text-charcoal stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
