export enum AppMode {
  PRESET = 'PRESET',
  CUSTOM = 'CUSTOM',
  STYLIST = 'STYLIST',
  REFERENCE = 'REFERENCE',
}

export interface PresetStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface WizardState {
  gender: 'Man' | 'Woman' | 'Non-binary' | '';
  length: 'Short' | 'Medium' | 'Long' | 'Bald' | '';
  texture: 'Straight' | 'Wavy' | 'Curly' | 'Coily' | '';
  color: string;
}

export const INITIAL_WIZARD_STATE: WizardState = {
  gender: '',
  length: '',
  texture: '',
  color: '',
};

export interface GeneratedImage {
  id: string;
  timestamp: number;
  original: string;
  generated: string;
  promptUsed: string;
}
