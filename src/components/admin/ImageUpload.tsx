"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
}

export default function ImageUpload({ onUpload, defaultImage }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImage || null);

  return (
    <div className="w-full">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"}
        onSuccess={(result: any) => {
          const url = result.info.secure_url;
          setImageUrl(url);
          onUpload(url);
        }}
      >
        {({ open }) => (
          <div 
            onClick={() => open()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" className="max-h-48 rounded-lg object-cover" />
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span className="text-gray-600 font-medium">Click to upload image</span>
                <span className="text-gray-400 text-sm mt-1">Supports JPG, PNG</span>
              </>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
