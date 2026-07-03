"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center text-gray-300 py-10">
        No testimonials available yet. Add some in the Admin Dashboard!
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto px-12">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[2rem] text-center shadow-xl min-h-[300px] flex flex-col justify-center">
        <div className="flex items-center justify-center gap-2 mb-6 text-secondary text-2xl tracking-widest">
          {'★'.repeat(current.rating || 5)}{'☆'.repeat(5 - (current.rating || 5))}
        </div>
        <p className="text-xl md:text-2xl text-gray-100 mb-8 font-light leading-relaxed italic">
          "{current.content}"
        </p>
        <div>
          <p className="font-bold font-serif text-xl">{current.name}</p>
          <p className="text-secondary text-sm mt-1">{current.role}</p>
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? "bg-secondary scale-125" : "bg-white/30 hover:bg-white/50"
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
