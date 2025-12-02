
export enum JobStability {
  STABLE = 'stable',
  CONTRACT = 'contract',
  STUDENT = 'student'
}

export enum CityTier {
  TIER1 = 'tier1', // High Cost of Living (e.g., London, NYC, Dubai)
  TIER2 = 'tier2', // Medium (e.g., Manchester, Dallas)
  TIER3 = 'tier3'  // Low
}

export enum BridePreference {
  SUNNAH = 'sunnah',     // Simplicity, ease
  BALANCED = 'balanced', // Market average
  GENEROUS = 'generous'  // High standard
}

export enum MahrType {
  PROMPT = 'prompt',   // Paid immediately
  DEFERRED = 'deferred', // Paid later
  SPLIT = 'split'      // Part now, part later
}

export interface GroomProfile {
  monthlyIncome: number;
  savings: number;
  monthlyExpenses: number;
  debtAmount: number;
  jobStability: JobStability;
  cityTier: CityTier;
  currency: string;
}

export interface BrideProfile {
  expectedMinMahr: number;
  expectedMaxMahr: number;
  preference: BridePreference;
  mahrType: MahrType;
  promptPercentage: number; // 0-100 if split
}

export interface CalculationResult {
  conservative: number;
  fair: number;
  generous: number;
  breakdown: {
    income: number;
    preferenceFactor: number;
    base: number;
    cityAdjustment: number;
    financialAdjustment: number;
    adjustedBeforeAlignment: number;
    averageExpectation: number;
    finalAligned: number;
  };
  promptAmount?: number;
  deferredAmount?: number;
}

export interface AiInsight {
  explanation: string;
  culturalNote: string;
  negotiationTip: string;
}
