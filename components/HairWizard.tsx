"use client";

import React, { useState } from "react";
import { WizardState, INITIAL_WIZARD_STATE } from "@/types";
import { User, Sparkles, Loader2 } from "lucide-react";

interface HairWizardProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  onAnalyze?: () => Promise<string>;
}

const HairWizard: React.FC<HairWizardProps> = ({
  onGenerate,
  isGenerating,
  onAnalyze,
}) => {
  const [mode, setMode] = useState<"choose" | "manual" | "ai">("choose");
  const [step, setStep] = useState(1);
  const [choices, setChoices] = useState<WizardState>(INITIAL_WIZARD_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const updateChoice = (key: keyof WizardState, value: string) => {
    setChoices((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const generatePromptFromChoices = () => {
    const { gender, length, texture, color } = choices;
    return `A ${length.toLowerCase()} ${texture.toLowerCase()} hairstyle for a ${gender.toLowerCase()} with ${color.toLowerCase()} hair color. Professional salon style, perfectly fitted to the face.`;
  };

  const handleFinalSubmit = () => {
    const prompt = generatePromptFromChoices();
    onGenerate(prompt);
  };

  const handleAiAnalyze = async () => {
    if (!onAnalyze) return;
    setIsAnalyzing(true);
    try {
      const suggestion = await onAnalyze();
      setAiSuggestion(suggestion);
    } catch (e) {
      console.error(e);
      setAiSuggestion("Could not analyze. Please try manual selection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAiGenerate = () => {
    if (aiSuggestion) {
      onGenerate(aiSuggestion);
    }
  };

  const resetToChoose = () => {
    setMode("choose");
    setStep(1);
    setChoices(INITIAL_WIZARD_STATE);
    setAiSuggestion(null);
  };

  if (mode === "choose") {
    return (
      <div className="max-w-sm mx-auto space-y-4">
        <p className="text-center text-sm text-neutral-500 mb-6">
          How would you like to find your style?
        </p>
        <button
          onClick={() => {
            setMode("manual");
          }}
          className="w-full p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <User size={18} className="text-neutral-600" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 text-sm">
              Manual Selection
            </p>
            <p className="text-xs text-neutral-400">
              Answer questions to build your style
            </p>
          </div>
        </button>
        {onAnalyze && (
          <button
            onClick={() => {
              setMode("ai");
              handleAiAnalyze();
            }}
            className="w-full p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 text-sm">
                AI Recommend
              </p>
              <p className="text-xs text-neutral-400">
                Let AI analyze your face and suggest
              </p>
            </div>
          </button>
        )}
      </div>
    );
  }

  if (mode === "ai") {
    return (
      <div className="max-w-sm mx-auto space-y-6">
        {isAnalyzing ? (
          <div className="text-center py-12">
            <Loader2
              size={24}
              className="animate-spin text-neutral-400 mx-auto mb-3"
            />
            <p className="text-sm text-neutral-500">
              Analyzing your features...
            </p>
          </div>
        ) : aiSuggestion ? (
          <>
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                AI Recommendation
              </p>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-700">{aiSuggestion}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetToChoose}
                className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Sparkles size={14} /> Apply This Style
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handleAiAnalyze}
              disabled={isAnalyzing}
              className="w-full text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Try another suggestion
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500 mb-4">
              Could not get AI recommendation
            </p>
            <button
              onClick={resetToChoose}
              className="text-sm text-neutral-900 font-medium"
            >
              Try manual selection
            </button>
          </div>
        )}
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-neutral-700 text-center">
              Who are we styling?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["Man", "Woman", "Other"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    updateChoice("gender", opt);
                    nextStep();
                  }}
                  className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all text-sm font-medium text-neutral-700"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-neutral-700 text-center">
              Desired length?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Short", "Medium", "Long", "Bald"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    updateChoice("length", opt);
                    nextStep();
                  }}
                  className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all text-sm font-medium text-neutral-700"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-neutral-700 text-center">
              Hair texture?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Straight", "Wavy", "Curly", "Coily"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    updateChoice("texture", opt);
                    nextStep();
                  }}
                  className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all text-sm font-medium text-neutral-700"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-neutral-700 text-center">
              Hair color?
            </p>
            <input
              type="text"
              placeholder="e.g. Dark Brown, Platinum Blonde"
              className="w-full p-3 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-sm bg-neutral-50"
              onChange={(e) => updateChoice("color", e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && choices.color && handleFinalSubmit()
              }
            />
            <button
              onClick={handleFinalSubmit}
              disabled={!choices.color || isGenerating}
              className="w-full px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={resetToChoose}
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          ← Back
        </button>
        <span className="text-xs text-neutral-400">{step}/4</span>
      </div>

      <div className="w-full h-1 bg-neutral-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {renderStep()}

      {step > 1 && (
        <div className="mt-6 pt-4 border-t border-neutral-100">
          <button
            onClick={prevStep}
            className="text-xs text-neutral-400 hover:text-neutral-600"
          >
            ← Previous
          </button>
          <p className="text-xs text-neutral-400 mt-2">
            {Object.values(choices).filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default HairWizard;
