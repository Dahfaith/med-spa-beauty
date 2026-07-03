import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|mov|ogg)$/i) !== null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-soft-cream pt-20">
      {/* Hero */}
      <section className="bg-primary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Visual Experience</span>
          <h1 className="text-5xl font-serif font-bold mb-6">Our Gallery</h1>
          <p className="text-xl font-light text-gray-200">
            A glimpse into our luxurious facilities and professional training environment.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <GalleryClient initialImages={images || []} />
        </div>
      </section>
    </div>
  );
}
