"use client";

import { useState, useEffect } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";

export default function FloatingWidgets() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-white text-primary rounded-full shadow-lg flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all hover:-translate-y-1"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/2349153489582"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#20bd5a] transition-all hover:-translate-y-1 animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
