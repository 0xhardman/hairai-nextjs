"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div
        className={`relative border border-dashed rounded-xl p-6 transition-all duration-200 text-center cursor-pointer overflow-hidden
          ${
            isDragging
              ? "border-neutral-400 bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
          }
          ${selectedImage ? "border-neutral-300 bg-neutral-50 p-2" : "bg-white"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {selectedImage ? (
          <div className="relative group">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full aspect-[3/4] object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-sm font-medium flex items-center gap-1.5">
                <Upload size={14} /> Change
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-10 h-10 bg-neutral-100 text-neutral-400 rounded-lg flex items-center justify-center mb-3">
              <ImageIcon size={20} />
            </div>
            <p className="text-sm font-medium text-neutral-700">Upload photo</p>
            <p className="text-neutral-400 mt-1 text-xs">or drag and drop</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
