"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [currentIndex, testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center text-gray-300 py-10">
        No testimonials available yet. Add some in the Admin Dashboard!
      </div>
    );
  }

  const handlePrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setIsFading(false);
    }, 300);
  };

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setIsFading(false);
    }, 300);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-12">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px] -z-10 mix-blend-screen" />

      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 md:p-16 rounded-[2.5rem] text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-h-[350px] flex flex-col justify-center overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:border-white/30">
        
        {/* Large Decorative Quote Icon */}
        <Quote className="absolute top-6 left-6 text-white/5 w-32 h-32 md:w-48 md:h-48 transform -rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110" />

        <div className={`relative z-10 transition-all duration-300 ease-in-out ${isFading ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-5 h-5 md:w-6 md:h-6 ${i < (current.rating || 5) ? 'text-secondary fill-secondary drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'text-white/20 fill-white/20'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          
          <p className="text-xl md:text-3xl text-white mb-10 font-light leading-relaxed md:leading-loose">
            "{current.content}"
          </p>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-1 bg-secondary rounded-full mb-4 opacity-50" />
            <p className="font-bold font-serif text-xl md:text-2xl tracking-wide">{current.name}</p>
            <p className="text-gray-300 text-sm mt-1 uppercase tracking-widest font-medium">{current.role}</p>
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/30 hover:scale-110 z-20 shadow-lg"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={28} className="transform -translate-x-0.5" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/30 hover:scale-110 z-20 shadow-lg"
            aria-label="Next testimonial"
          >
            <ChevronRight size={28} className="transform translate-x-0.5" />
          </button>
          
          {/* Dynamic Navigation Dots */}
          <div className="flex justify-center items-center gap-3 mt-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsFading(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsFading(false);
                  }, 300);
                }}
                className={`transition-all duration-500 rounded-full ${
                  idx === currentIndex 
                    ? "w-8 h-2 bg-secondary shadow-[0_0_10px_rgba(212,175,55,0.8)]" 
                    : "w-2 h-2 bg-white/30 hover:bg-white/60 hover:scale-125"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
