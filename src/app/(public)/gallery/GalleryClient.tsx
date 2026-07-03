"use client";

import { useState } from "react";

interface GalleryClientProps {
  initialImages: any[];
}

export default function GalleryClient({ initialImages }: GalleryClientProps) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Spa", "Training", "Clinic"];

  const filteredImages = filter === "All" 
    ? initialImages 
    : initialImages.filter(img => img.category === filter);

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|mov|ogg)$/i) !== null;
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === cat 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {!filteredImages || filteredImages.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No media found for the category "{filter}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((img: any) => (
            <div key={img.id} className="relative group overflow-hidden rounded-2xl shadow-sm aspect-[4/5] bg-gray-200 cursor-pointer">
              {isVideo(img.image_url) ? (
                <video src={img.image_url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={img.image_url} alt={img.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              )}
              
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 text-white font-serif font-bold text-xl tracking-wider uppercase transition-opacity duration-300 drop-shadow-md">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
