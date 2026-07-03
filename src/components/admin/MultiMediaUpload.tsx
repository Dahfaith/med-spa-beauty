"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

interface MultiMediaUploadProps {
  onUpload: (urls: string[]) => void;
}

export default function MultiMediaUpload({ onUpload }: MultiMediaUploadProps) {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  return (
    <div className="w-full">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
        options={{
          multiple: true,
          clientAllowedFormats: ["images", "video"],
          maxFiles: 10
        }}
        onSuccess={(result: any, { widget }) => {
          const url = result.info.secure_url;
          setMediaUrls((prev) => {
            const updated = [...prev, url];
            // If this is the last file or we're just accumulating, we should eventually pass them all up.
            // A simple approach is just passing the updated array every time.
            onUpload(updated);
            return updated;
          });
        }}
      >
        {({ open }) => (
          <div 
            onClick={() => open()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {mediaUrls.length > 0 ? (
              <div className="text-center">
                <p className="text-green-600 font-bold mb-2">✓ {mediaUrls.length} files staged for upload</p>
                <span className="text-gray-500 text-sm">Click here to add more</span>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span className="text-gray-600 font-medium">Click to bulk upload media</span>
                <span className="text-gray-400 text-sm mt-1">Supports JPG, PNG, MP4 (Max 10)</span>
              </>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
