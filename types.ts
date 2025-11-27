import { LucideIcon } from 'lucide-react';

export enum ElementGroup {
  DEFENSIVE = 'DEFENSIVE',   // Fear, Loss, Protection
  PROCESSING = 'PROCESSING', // Info handling, Filtering
  SOCIAL = 'SOCIAL',         // Tribal, External validation
  TEMPORAL = 'TEMPORAL'      // Time, Ego, Projection
}

export interface CognitiveElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: ElementGroup;
  period: number;
  description: string;
  icon: LucideIcon;
}

export interface SynthesisResult {
  name: string;
  formula: string;
  description: string;
  stability: number; // 0-100
  type: 'Archetype' | 'Phenomenon' | 'Paradox' | 'Compound';
}

export interface DiagnosisResult {
  summary: string;
  elements: {
    symbol: string;
    confidence: number;
    reasoning: string;
  }[];
}