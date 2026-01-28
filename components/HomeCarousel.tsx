
import React, { useState, useEffect, useCallback } from 'react';
import WhistleIcon from './WhistleIcon';

interface HomeCarouselProps {
  banners: any[];
  onRegisterClick: () => void;
  onManifestoClick: () => void;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ banners, onRegisterClick, onManifestoClick }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  useEffect(() => {
    if (!isPaused && banners.length > 0) {
      const interval = setInterval(nextSlide, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide, banners.length]);

  if (banners.length === 0) return null;

  return (
    <section 
      className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {banners.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Background Image with Overlays */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#8b0000] via-transparent to-transparent z-10"></div>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Wrapper */}
          <div className="container mx-auto px-4 h-full relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 pt-20">
            {/* Text Side */}
            <div className="w-full md:w-3/5 text-center md:text-left text-white animate-in slide-in-from-left duration-700">
              <div className="mb-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <WhistleIcon className="w-24 h-24 md:w-32 md:h-32 transform -rotate-12" />
                <div>
                   <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-2xl font-poppins leading-tight">
                    {slide.title}
                  </h2>
                  <p 
                    className="font-bold uppercase tracking-widest text-sm md:text-2xl italic drop-shadow-md"
                    style={{ color: slide.accent }}
                  >
                    "{slide.subtitle}"
                  </p>
                </div>
              </div>

              <div className="max-w-xl mx-auto md:mx-0 space-y-8">
                <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4">
                  <button 
                    onClick={onRegisterClick}
                    className="px-12 py-5 bg-white text-red-800 rounded-2xl font-black uppercase tracking-tighter hover:bg-yellow-400 hover:text-black transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-sm md:text-lg transform hover:-translate-y-1"
                  >
                    {slide.cta}
                  </button>
                  <button 
                    onClick={onManifestoClick}
                    className="flex items-center justify-center gap-4 px-12 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-tighter border-2 border-white/30 hover:bg-red-500 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)] transform hover:-translate-y-1"
                  >
                    தொலைநோக்கு 2026
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Side (Hidden on Mobile for some slides if preferred, or integrated) */}
            {index === 0 && (
               <div className="hidden md:flex w-full md:w-2/5 justify-end animate-in slide-in-from-right duration-1000">
                  <div className="relative w-full max-w-lg aspect-[4/5] rounded-l-[10rem] overflow-hidden shadow-2xl border-l-8 border-yellow-400/50">
                    <img src={slide.image} alt="Thalaivar" className="w-full h-full object-cover" />
                  </div>
               </div>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              current === i ? 'w-12 h-3 bg-yellow-400' : 'w-3 h-3 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-yellow-400 z-40 transition-all duration-[6000ms] ease-linear"
        style={{ width: isPaused ? '0%' : '100%', opacity: isPaused ? 0 : 1 }}
        key={current}
      />
      
      {/* Side Arrows (Desktop Only) */}
      <button 
        onClick={() => setCurrent(prev => prev === 0 ? banners.length - 1 : prev - 1)}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>
  );
};

export default HomeCarousel;
