"use client";

import React, { useState } from "react";
import { Sparkles, Dice5, ScanFace, Loader2 } from "lucide-react";
import { RANDOM_PROMPTS } from "@/lib/constants";

interface CustomPromptProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  onAnalyze?: () => Promise<string>;
}

const CustomPrompt: React.FC<CustomPromptProps> = ({
  onGenerate,
  isGenerating,
  onAnalyze,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRandom = () => {
    const random =
      RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
  };

  const handleAnalysis = async () => {
    if (!onAnalyze) return;
    setIsAnalyzing(true);
    try {
      const suggestion = await onAnalyze();
      setPrompt(suggestion);
    } catch (e) {
      console.error(e);
      setPrompt("Could not analyze image. Please try typing a description.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-neutral-700">
            Describe your style
          </label>
          {onAnalyze && (
            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing || isGenerating}
              className="text-xs flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <ScanFace size={12} />
              )}
              AI Recommend
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isAnalyzing
                ? "Analyzing..."
                : "e.g., Messy bun with loose strands, platinum blonde..."
            }
            className="w-full p-4 rounded-lg border border-neutral-200 focus:border-neutral-400 focus:ring-0 outline-none resize-none h-28 text-sm text-neutral-700 bg-neutral-50 placeholder:text-neutral-400 disabled:bg-neutral-100"
            disabled={isGenerating || isAnalyzing}
          />
          <button
            type="button"
            onClick={handleRandom}
            className="absolute bottom-3 right-3 text-xs text-neutral-400 hover:text-neutral-600 px-2 py-1 rounded flex items-center gap-1.5 transition-colors"
          >
            <Dice5 size={12} />
            Random
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating || isAnalyzing}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all
            ${
              !prompt.trim() || isGenerating || isAnalyzing
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]"
            }
          `}
        >
          {isGenerating ? (
            "Generating..."
          ) : (
            <>
              <Sparkles size={14} />
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomPrompt;
