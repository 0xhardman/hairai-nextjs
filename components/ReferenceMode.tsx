"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Wand2 } from "lucide-react";

interface ReferenceModeProps {
  onGenerate: (referenceImage: string) => void;
  isGenerating: boolean;
}

const ReferenceMode: React.FC<ReferenceModeProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [refImage, setRefImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-slate-800">Match a Style</h3>
        <p className="text-sm text-slate-500">
          Upload a photo of a hairstyle you like (e.g., from Pinterest or a
          celebrity), and we&apos;ll apply it to you.
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all h-64 flex flex-col items-center justify-center
            ${
              refImage
                ? "border-indigo-500 bg-indigo-50/30"
                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
            }
        `}
        onClick={() => document.getElementById("ref-upload")?.click()}
      >
        <input
          id="ref-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {refImage ? (
          <div className="relative w-full h-full">
            <img
              src={refImage}
              alt="Reference"
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Upload size={14} /> Change Image
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon size={24} />
            </div>
            <div>
              <span className="text-indigo-600 font-medium block">
                Upload Reference Photo
              </span>
              <span className="text-xs text-slate-400">Target hairstyle</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => refImage && onGenerate(refImage)}
          disabled={!refImage || isGenerating}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white shadow-lg transition-all
            ${
              !refImage || isGenerating
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
            }
          `}
        >
          {isGenerating ? (
            "Transferring Style..."
          ) : (
            <>
              <Wand2 size={18} />
              Transfer Style
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReferenceMode;
