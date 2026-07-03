"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import MultiMediaUpload from "@/components/admin/MultiMediaUpload";

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [category, setCategory] = useState("Spa");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
    if (!error && data) setImages(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedUrls.length === 0) return alert("Please upload at least one media file.");
    
    setSaving(true);
    
    // Create an array of rows to insert
    const rows = uploadedUrls.map(url => ({
      image_url: url,
      category: category
    }));

    const { error } = await supabase.from("gallery_images").insert(rows);
    
    if (!error) {
      setIsModalOpen(false);
      setUploadedUrls([]);
      setCategory("Spa");
      fetchImages();
    } else {
      alert("Error saving: " + error.message);
    }
    setSaving(false);
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|mov|ogg)$/i) !== null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-serif text-gray-900">Manage Gallery</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          + Add Media (Bulk)
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-gray-100">
              {isVideo(img.image_url) ? (
                <video src={img.image_url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={img.image_url} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <span className="text-white font-bold">{img.category}</span>
                <button 
                  onClick={async () => {
                    await supabase.from("gallery_images").delete().eq("id", img.id);
                    fetchImages();
                  }}
                  className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && <p className="col-span-4 text-center py-8 text-gray-500">No media in gallery.</p>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
            <h3 className="text-xl font-bold mb-6">Bulk Upload to Gallery</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium">Category for these files</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-1 focus:ring-primary outline-none">
                  <option>Spa</option>
                  <option>Training</option>
                  <option>Clinic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 font-medium">Images or Videos</label>
                <MultiMediaUpload onUpload={(urls) => setUploadedUrls(urls)} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setUploadedUrls([]); }} className="px-6 py-2 border rounded-full font-medium hover:bg-gray-50">Cancel</button>
                <button disabled={saving} type="submit" className="px-6 py-2 bg-primary text-white rounded-full font-medium shadow-md hover:bg-primary/90 disabled:opacity-50">
                  {saving ? "Saving..." : "Save to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
