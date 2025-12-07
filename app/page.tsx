"use client";

import React, { useState } from "react";
import { AppMode, GeneratedImage, PresetStyle } from "@/types";
import {
  generateHairstyle,
  generateHairstyleVariations,
  generateHairstyleFromReference,
  analyzeFaceAndSuggest,
} from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import PresetSelector from "@/components/PresetSelector";
import CustomPrompt from "@/components/CustomPrompt";
import HairWizard from "@/components/HairWizard";
import ReferenceMode from "@/components/ReferenceMode";
import ResultDisplay from "@/components/ResultDisplay";
import { Scissors, Grid, Wand2, UserCheck, ImagePlus } from "lucide-react";
import { PRESET_STYLES } from "@/lib/constants";

export default function Home() {
  const [mode, setMode] = useState<AppMode>(AppMode.PRESET);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedImage | null>(
    null
  );
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [currentVariations, setCurrentVariations] = useState<string[]>([]);

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const handleImageSelect = (base64: string) => {
    setUploadedImage(base64);
    setGeneratedResult(null);
    setHistory([]);
    setCurrentVariations([]);
    setError(null);
  };

  const addToHistory = (result: GeneratedImage) => {
    setHistory((prev) => [result, ...prev]);
  };

  const handleGenerate = async (promptText: string) => {
    if (!uploadedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentVariations([]);

    try {
      const resultImage = await generateHairstyle(uploadedImage, promptText);
      const newResult: GeneratedImage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        original: uploadedImage,
        generated: resultImage,
        promptUsed: promptText,
      };

      setGeneratedResult(newResult);
      addToHistory(newResult);
    } catch (err: any) {
      setError(err.message || "Failed to generate hairstyle. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFromReference = async (referenceImage: string) => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setError(null);
    setCurrentVariations([]);

    try {
      const resultImage = await generateHairstyleFromReference(
        uploadedImage,
        referenceImage
      );
      const newResult: GeneratedImage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        original: uploadedImage,
        generated: resultImage,
        promptUsed: "Style Match from Reference Image",
      };

      setGeneratedResult(newResult);
      addToHistory(newResult);
    } catch (err: any) {
      setError(err.message || "Failed to transfer style.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (refinementPrompt: string) => {
    if (!generatedResult) return;

    setIsGenerating(true);
    setError(null);
    setCurrentVariations([]);

    try {
      const resultImage = await generateHairstyle(
        generatedResult.generated,
        refinementPrompt
      );

      const newResult: GeneratedImage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        original: generatedResult.original,
        generated: resultImage,
        promptUsed: refinementPrompt,
      };

      setGeneratedResult(newResult);
      addToHistory(newResult);
    } catch (err: any) {
      setError(err.message || "Failed to refine hairstyle. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeFace = async (): Promise<string> => {
    if (!uploadedImage) throw new Error("No image");
    return await analyzeFaceAndSuggest(uploadedImage);
  };

  const handleGenerateVariations = async () => {
    if (!generatedResult) return;

    setIsGeneratingVariations(true);
    setError(null);

    try {
      const variations = await generateHairstyleVariations(
        generatedResult.original,
        generatedResult.promptUsed
      );

      if (variations.length === 0) {
        throw new Error("Could not generate variations.");
      }

      setCurrentVariations(variations);
    } catch (err: any) {
      setError(err.message || "Failed to generate variations.");
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleVariationSelect = (variationImage: string) => {
    if (!generatedResult) return;

    const newResult: GeneratedImage = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      original: generatedResult.original,
      generated: variationImage,
      promptUsed: generatedResult.promptUsed,
    };

    setGeneratedResult(newResult);
    addToHistory(newResult);
  };

  const handleHistorySelect = (result: GeneratedImage) => {
    setGeneratedResult(result);
    setCurrentVariations([]);
  };

  const handlePresetSelect = (preset: PresetStyle) => {
    setSelectedPresetId(preset.id);
  };

  const onPresetGenerate = () => {
    if (selectedPresetId) {
      const preset = PRESET_STYLES.find(
        (p: PresetStyle) => p.id === selectedPresetId
      );
      if (preset) {
        handleGenerate(preset.prompt);
      }
    }
  };

  const resetAll = () => {
    setGeneratedResult(null);
    setUploadedImage(null);
    setSelectedPresetId(null);
    setHistory([]);
    setCurrentVariations([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-neutral-900 text-white p-1.5 rounded-md">
              <Scissors size={16} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-neutral-900">
              HairAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            {uploadedImage && (
              <button
                onClick={resetAll}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {generatedResult ? (
          <ResultDisplay
            result={generatedResult}
            onReset={() => setGeneratedResult(null)}
            onRefine={handleRefine}
            isRefining={isGenerating}
            history={history}
            onSelectHistory={handleHistorySelect}
            onGenerateVariations={handleGenerateVariations}
            variations={currentVariations}
            isGeneratingVariations={isGeneratingVariations}
            onSelectVariation={handleVariationSelect}
          />
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full mb-12">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">
                  Try a new hairstyle
                </h1>
                <p className="text-neutral-400 text-sm">
                  Upload your photo and explore styles
                </p>
              </div>
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={uploadedImage}
              />
            </div>

            <div className="w-full">
              <div className="flex justify-center mb-8">
                <div className="inline-flex gap-1 bg-neutral-100 p-1 rounded-lg">
                  <button
                    onClick={() => setMode(AppMode.PRESET)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${
                        mode === AppMode.PRESET
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    <Grid size={14} /> Presets
                  </button>
                  <button
                    onClick={() => setMode(AppMode.CUSTOM)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${
                        mode === AppMode.CUSTOM
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    <Wand2 size={14} /> Custom
                  </button>
                  <button
                    onClick={() => setMode(AppMode.STYLIST)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${
                        mode === AppMode.STYLIST
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    <UserCheck size={14} /> Consultant
                  </button>
                  <button
                    onClick={() => setMode(AppMode.REFERENCE)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all
                      ${
                        mode === AppMode.REFERENCE
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    <ImagePlus size={14} /> Reference
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-100">
                {mode === AppMode.PRESET && (
                  <PresetSelector
                    onSelect={handlePresetSelect}
                    selectedPresetId={selectedPresetId}
                    onGenerate={onPresetGenerate}
                    isGenerating={isGenerating}
                  />
                )}

                {mode === AppMode.CUSTOM && (
                  <CustomPrompt
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    onAnalyze={handleAnalyzeFace}
                  />
                )}

                {mode === AppMode.STYLIST && (
                  <HairWizard
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    onAnalyze={uploadedImage ? handleAnalyzeFace : undefined}
                  />
                )}

                {mode === AppMode.REFERENCE && (
                  <ReferenceMode
                    onGenerate={handleGenerateFromReference}
                    isGenerating={isGenerating}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
