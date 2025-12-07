"use client";

import React from "react";
import { PRESET_STYLES } from "@/lib/constants";
import { PresetStyle } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface PresetSelectorProps {
  onSelect: (preset: PresetStyle) => void;
  selectedPresetId: string | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

const HairstyleIcon = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const hairColor = "#1e293b";
  const hairHighlight = "#475569";
  const skinColor = "#fcd5c0";
  const skinShadow = "#f5b89a";

  const HeadBase = () => (
    <g>
      <ellipse cx="50" cy="88" rx="10" ry="8" fill={skinColor} />
      <ellipse cx="50" cy="86" rx="8" ry="4" fill={skinShadow} opacity="0.3" />
      <ellipse cx="50" cy="52" rx="22" ry="28" fill={skinColor} />
      <ellipse cx="27" cy="52" rx="4" ry="6" fill={skinColor} />
      <ellipse cx="73" cy="52" rx="4" ry="6" fill={skinColor} />
      <ellipse cx="27" cy="52" rx="2" ry="4" fill={skinShadow} opacity="0.3" />
      <ellipse cx="73" cy="52" rx="2" ry="4" fill={skinShadow} opacity="0.3" />
    </g>
  );

  const renderHair = () => {
    switch (id) {
      case "buzz-cut":
        return (
          <g>
            <path
              d="M28 48 C28 30 36 18 50 18 C64 18 72 30 72 48 L72 42 C72 26 64 16 50 16 C36 16 28 26 28 42 Z"
              fill={hairColor}
            />
            <path
              d="M28 48 L30 40 L30 50 L28 48"
              fill={hairHighlight}
              opacity="0.6"
            />
            <path
              d="M72 48 L70 40 L70 50 L72 48"
              fill={hairHighlight}
              opacity="0.6"
            />
            <circle cx="40" cy="28" r="1" fill={hairHighlight} opacity="0.4" />
            <circle cx="50" cy="24" r="1" fill={hairHighlight} opacity="0.4" />
            <circle cx="60" cy="28" r="1" fill={hairHighlight} opacity="0.4" />
          </g>
        );
      case "long-wavy":
        return (
          <g>
            <path
              d="M22 35 C18 50 16 70 22 92 C28 96 38 94 50 94 C62 94 72 96 78 92 C84 70 82 50 78 35"
              fill={hairColor}
            />
            <path
              d="M50 14 C32 14 24 28 24 45 L24 55 C28 50 32 48 36 50 L36 40 C36 28 42 22 50 22 C58 22 64 28 64 40 L64 50 C68 48 72 50 76 55 L76 45 C76 28 68 14 50 14 Z"
              fill={hairColor}
            />
            <path
              d="M26 55 C24 65 22 75 26 88"
              stroke={hairHighlight}
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M74 55 C76 65 78 75 74 88"
              stroke={hairHighlight}
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
          </g>
        );
      case "bob-cut":
        return (
          <g>
            <path
              d="M50 14 C30 14 22 30 22 50 L22 68 C24 72 30 74 36 72 L36 50 C36 40 42 34 50 34 C58 34 64 40 64 50 L64 72 C70 74 76 72 78 68 L78 50 C78 30 70 14 50 14 Z"
              fill={hairColor}
            />
            <path
              d="M32 40 C32 28 40 20 50 20 C60 20 68 28 68 40 L64 38 C64 30 58 24 50 24 C42 24 36 30 36 38 Z"
              fill={hairColor}
            />
          </g>
        );
      case "pompadour":
        return (
          <g>
            <path
              d="M28 45 C28 38 30 32 34 28 L34 50 C32 52 30 50 28 48 Z"
              fill={hairColor}
              opacity="0.8"
            />
            <path
              d="M72 45 C72 38 70 32 66 28 L66 50 C68 52 70 50 72 48 Z"
              fill={hairColor}
              opacity="0.8"
            />
            <path
              d="M34 32 C34 18 38 6 50 6 C68 6 74 20 70 36 C68 28 62 22 50 22 C40 22 36 28 34 32 Z"
              fill={hairColor}
            />
            <path
              d="M40 16 C44 10 54 10 62 18"
              stroke={hairHighlight}
              strokeWidth="3"
              fill="none"
              opacity="0.4"
              strokeLinecap="round"
            />
          </g>
        );
      case "pixie":
        return (
          <g>
            <path
              d="M28 45 C28 28 38 16 50 16 C62 16 72 28 72 45 C72 40 68 32 62 28 C58 32 54 28 50 30 C46 28 42 32 38 28 C32 32 28 40 28 45 Z"
              fill={hairColor}
            />
            <path
              d="M30 42 C32 32 38 24 48 22 C42 28 38 36 36 44 Z"
              fill={hairColor}
            />
            <path d="M38 24 L42 18 L46 26" fill={hairColor} />
            <path d="M48 22 L52 14 L56 24" fill={hairColor} />
            <path d="M56 24 L62 18 L64 28" fill={hairColor} />
          </g>
        );
      case "afro":
        return (
          <g>
            <ellipse cx="50" cy="42" rx="34" ry="32" fill={hairColor} />
            <circle cx="30" cy="32" r="4" fill={hairHighlight} opacity="0.15" />
            <circle cx="42" cy="22" r="5" fill={hairHighlight} opacity="0.15" />
            <circle cx="58" cy="22" r="5" fill={hairHighlight} opacity="0.15" />
            <circle cx="70" cy="32" r="4" fill={hairHighlight} opacity="0.15" />
            <circle cx="50" cy="16" r="4" fill={hairHighlight} opacity="0.15" />
          </g>
        );
      case "undercut":
        return (
          <g>
            <path
              d="M28 48 C28 38 32 30 38 26 L38 52 C34 54 30 52 28 48 Z"
              fill={hairHighlight}
              opacity="0.4"
            />
            <path
              d="M72 48 C72 38 68 30 62 26 L62 52 C66 54 70 52 72 48 Z"
              fill={hairHighlight}
              opacity="0.4"
            />
            <path
              d="M38 28 C38 18 44 12 50 12 C60 12 68 18 72 28 C72 32 68 36 60 38 L58 32 C54 34 48 34 44 32 L42 38 C38 36 36 32 38 28 Z"
              fill={hairColor}
            />
          </g>
        );
      case "slick-back":
        return (
          <g>
            <path
              d="M28 48 C28 32 36 18 50 18 C64 18 72 32 72 48 L72 42 C72 28 64 16 50 16 C36 16 28 28 28 42 Z"
              fill={hairColor}
            />
            <path
              d="M35 24 C40 20 50 18 50 18"
              stroke={hairHighlight}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
            <path
              d="M65 24 C60 20 50 18 50 18"
              stroke={hairHighlight}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
          </g>
        );
      case "curly":
        return (
          <g>
            <ellipse cx="50" cy="35" rx="28" ry="24" fill={hairColor} />
            <circle cx="30" cy="35" r="6" fill={hairColor} />
            <circle cx="70" cy="35" r="6" fill={hairColor} />
            <circle cx="35" cy="22" r="5" fill={hairColor} />
            <circle cx="50" cy="16" r="6" fill={hairColor} />
            <circle cx="65" cy="22" r="5" fill={hairColor} />
            <circle cx="35" cy="25" r="3" fill={hairHighlight} opacity="0.2" />
            <circle cx="50" cy="18" r="3" fill={hairHighlight} opacity="0.2" />
            <circle cx="65" cy="25" r="3" fill={hairHighlight} opacity="0.2" />
          </g>
        );
      case "braids":
        return (
          <g>
            <path
              d="M30 45 C30 30 38 18 50 18 C62 18 70 30 70 45"
              fill={hairColor}
            />
            <path
              d="M34 24 L34 50"
              stroke={hairHighlight}
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M42 22 L42 52"
              stroke={hairHighlight}
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M50 20 L50 54"
              stroke={hairHighlight}
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M58 22 L58 52"
              stroke={hairHighlight}
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M66 24 L66 50"
              stroke={hairHighlight}
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
        );
      case "man-bun":
        return (
          <g>
            <path
              d="M28 48 C28 38 32 30 38 26 L40 50 C36 52 30 50 28 48 Z"
              fill={hairColor}
              opacity="0.7"
            />
            <path
              d="M72 48 C72 38 68 30 62 26 L60 50 C64 52 70 50 72 48 Z"
              fill={hairColor}
              opacity="0.7"
            />
            <path
              d="M38 28 C38 22 44 18 50 18 C56 18 62 22 62 28 C62 24 58 20 50 20 C42 20 38 24 38 28 Z"
              fill={hairColor}
            />
            <ellipse cx="50" cy="12" rx="12" ry="10" fill={hairColor} />
            <ellipse
              cx="50"
              cy="10"
              rx="8"
              ry="6"
              fill={hairHighlight}
              opacity="0.15"
            />
          </g>
        );
      case "mohawk":
        return (
          <g>
            <path
              d="M28 48 C28 38 32 28 40 24 L40 52 C36 54 30 52 28 48 Z"
              fill={hairHighlight}
              opacity="0.3"
            />
            <path
              d="M72 48 C72 38 68 28 60 24 L60 52 C64 54 70 52 72 48 Z"
              fill={hairHighlight}
              opacity="0.3"
            />
            <path
              d="M42 50 L42 24 C42 14 46 6 50 6 C54 6 58 14 58 24 L58 50 C56 48 54 46 50 46 C46 46 44 48 42 50 Z"
              fill={hairColor}
            />
            <path d="M46 12 L50 6 L54 12" fill={hairColor} />
          </g>
        );
      default:
        return <ellipse cx="50" cy="35" rx="25" ry="20" fill={hairColor} />;
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderHair()}
      <HeadBase />
    </svg>
  );
};

const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelect,
  selectedPresetId,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {PRESET_STYLES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`group relative rounded-xl transition-all duration-200 overflow-hidden
              ${
                selectedPresetId === preset.id
                  ? "ring-2 ring-neutral-900 ring-offset-2"
                  : "hover:bg-neutral-50"
              }
            `}
          >
            <div className="aspect-square flex flex-col items-center justify-center p-3 bg-neutral-50 rounded-xl">
              <HairstyleIcon
                id={preset.id}
                className="w-16 h-16 mb-2 transition-transform duration-200 group-hover:scale-105"
              />
              <span
                className={`text-xs font-medium text-center leading-tight
                ${
                  selectedPresetId === preset.id
                    ? "text-neutral-900"
                    : "text-neutral-600"
                }`}
              >
                {preset.name}
              </span>
            </div>
            {selectedPresetId === preset.id && (
              <div className="absolute top-1.5 right-1.5">
                <CheckCircle2 size={16} className="text-neutral-900 fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={!selectedPresetId || isGenerating}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all
            ${
              !selectedPresetId || isGenerating
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]"
            }
          `}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default PresetSelector;
