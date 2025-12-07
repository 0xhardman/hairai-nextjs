"use client";

import React, { useState } from "react";
import {
  Download,
  Share2,
  Sparkles,
  Send,
  History as HistoryIcon,
  Layers,
  Check,
  X,
  Twitter,
  Facebook,
  MessageCircle,
  Copy,
} from "lucide-react";
import { GeneratedImage } from "@/types";

interface ResultDisplayProps {
  result: GeneratedImage;
  onReset: () => void;
  onRefine: (prompt: string) => void;
  isRefining: boolean;
  history: GeneratedImage[];
  onSelectHistory: (result: GeneratedImage) => void;
  onGenerateVariations: () => void;
  variations: string[];
  isGeneratingVariations: boolean;
  onSelectVariation: (image: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onReset,
  onRefine,
  isRefining,
  history,
  onSelectHistory,
  onGenerateVariations,
  variations,
  isGeneratingVariations,
  onSelectVariation,
}) => {
  const [refineText, setRefineText] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.generated;
    link.download = `hairai-makeover-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefineSubmit = () => {
    if (refineText.trim()) {
      onRefine(refineText);
      setRefineText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRefineSubmit();
    }
  };

  const convertBase64ToFile = async (base64: string, filename: string) => {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/jpeg" });
  };

  const handleShareClick = async () => {
    try {
      const file = await convertBase64ToFile(
        result.generated,
        "hairai-makeover.jpg"
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My New Hairstyle",
          text: "Check out my new look created with HairAI!",
        });
      } else {
        setShowShareModal(true);
      }
    } catch (error) {
      console.log("Share API error or cancelled", error);
      setShowShareModal(true);
    }
  };

  const handleCopyImage = async () => {
    try {
      const res = await fetch(result.generated);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
      navigator.clipboard.writeText(result.promptUsed);
      alert("Could not copy image directly. Prompt copied instead.");
    }
  };

  const shareToSocial = (platform: "twitter" | "facebook" | "whatsapp") => {
    const text = encodeURIComponent(
      "Check out my new AI hairstyle makeover! #HairAI"
    );
    const url = encodeURIComponent(window.location.href);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Original
          </span>
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
            <img
              src={result.original}
              alt="Original"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-neutral-900 uppercase tracking-wide">
            Result
          </span>
          <div className="aspect-[3/4] rounded-xl overflow-hidden relative group bg-neutral-100 ring-1 ring-neutral-200">
            <img
              src={result.generated}
              alt="Generated Hairstyle"
              className="w-full h-full object-cover"
            />
            {isRefining && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-neutral-600 text-xs">Refining...</span>
                </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-white/70 text-xs">Prompt</p>
              <p className="text-white text-sm line-clamp-2">
                {result.promptUsed}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-lg flex items-center gap-2 p-1">
        <div className="pl-3 text-neutral-400">
          <Sparkles size={16} />
        </div>
        <input
          type="text"
          value={refineText}
          onChange={(e) => setRefineText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRefining || isGeneratingVariations}
          placeholder="Refine: 'shorter', 'add bangs', 'blonde'..."
          className="flex-1 py-2.5 bg-transparent outline-none text-sm text-neutral-700 placeholder:text-neutral-400"
        />
        <button
          onClick={handleRefineSubmit}
          disabled={!refineText.trim() || isRefining || isGeneratingVariations}
          className={`p-2 rounded-md transition-all ${
            refineText.trim() && !isRefining
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <Send size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Download size={14} /> Download
        </button>
        <button
          onClick={handleShareClick}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <Share2 size={14} /> Share
        </button>
        <button
          onClick={handleCopyImage}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              copyFeedback
                ? "bg-green-50 text-green-600"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }
          `}
        >
          {copyFeedback ? <Check size={14} /> : <Copy size={14} />}
          {copyFeedback ? "Copied" : "Copy"}
        </button>
        <button
          onClick={onGenerateVariations}
          disabled={isGeneratingVariations || isRefining}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              isGeneratingVariations
                ? "bg-neutral-100 text-neutral-400 cursor-wait"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }
          `}
        >
          {isGeneratingVariations ? (
            <div className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Layers size={14} />
          )}
          Variations
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors"
        >
          Reset
        </button>
      </div>

      {(variations.length > 0 || isGeneratingVariations) && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 px-1">
            <Layers size={14} className="text-neutral-400" />
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Variations
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {isGeneratingVariations && variations.length === 0
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] rounded-lg bg-neutral-100 animate-pulse"
                    ></div>
                  ))
              : variations.map((varImg, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectVariation(varImg)}
                    className="relative group aspect-[3/4] rounded-lg overflow-hidden hover:ring-2 hover:ring-neutral-900 hover:ring-offset-1 focus:outline-none transition-all"
                  >
                    <img
                      src={varImg}
                      alt={`Variation ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-neutral-900 px-2 py-1 rounded text-xs font-medium transition-opacity">
                        Select
                      </span>
                    </div>
                  </button>
                ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-3 pt-6 mt-6 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-400 px-1">
            <HistoryIcon size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">
              History
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className={`flex-shrink-0 relative w-14 aspect-square rounded-lg overflow-hidden transition-all snap-start
                    ${
                      result.id === item.id
                        ? "ring-2 ring-neutral-900 ring-offset-1"
                        : "opacity-50 hover:opacity-100"
                    }
                `}
              >
                <img
                  src={item.generated}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          ></div>
          <div className="bg-white rounded-xl p-5 w-full max-w-xs relative z-10 shadow-xl">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-medium text-neutral-900 mb-4">
              Share
            </h3>

            <div className="flex justify-center mb-5">
              <div className="w-24 aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={result.generated}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => shareToSocial("twitter")}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <Twitter size={16} /> X
              </button>
              <button
                onClick={() => shareToSocial("facebook")}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#1877F2] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Facebook size={16} /> Facebook
              </button>
              <button
                onClick={() => shareToSocial("whatsapp")}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} /> WhatsApp
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-100"></div>
                <span className="flex-shrink-0 mx-3 text-neutral-300 text-xs">
                  or
                </span>
                <div className="flex-grow border-t border-neutral-100"></div>
              </div>

              <button
                onClick={() => {
                  handleCopyImage();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                <Copy size={16} /> Copy Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
