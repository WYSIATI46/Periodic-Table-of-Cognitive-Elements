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
  relatedSymbols?: string[]; // For Affinity Mapping
}

export interface SynthesisResult {
  id?: string; // For notebook persistence
  name: string;
  formula: string;
  description: string;
  useCase: string; // Real-world fictitious example
  stability: number; // 0-100
  type: 'Archetype' | 'Phenomenon' | 'Paradox' | 'Compound';
  timestamp?: number;
}

export interface DiagnosisResult {
  title: string; // Short 3-5 word diagnostic title
  assessment: string; // Detailed analysis (The "Summary Assessment")
  recommendation: string; // Actionable next steps
  elements: {
    symbol: string;
    confidence: number;
    reasoning: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
