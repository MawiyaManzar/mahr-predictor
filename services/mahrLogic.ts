
import { GroomProfile, BrideProfile, CalculationResult, BridePreference, CityTier } from '../types';

/**
 * Calculates the Mahr estimates based on the PRD logic.
 */
export const calculateMahr = (groom: GroomProfile, bride: BrideProfile): CalculationResult => {
  // Step 1: Base Mahr
  let factor = 1.5; // Default balanced
  if (bride.preference === BridePreference.SUNNAH) factor = 0.5;
  if (bride.preference === BridePreference.GENEROUS) factor = 3.0;

  const initialBase = groom.monthlyIncome * factor;
  let baseMahr = initialBase;

  // Step 2: Cost of Living
  const cityMultipliers: Record<CityTier, number> = {
    [CityTier.TIER1]: 1.4,
    [CityTier.TIER2]: 1.0,
    [CityTier.TIER3]: 0.8,
  };
  const cityMult = cityMultipliers[groom.cityTier];
  baseMahr *= cityMult;

  // Step 3: Savings & Debt Adjustments
  let financialAdjustment = 0;
  
  // Savings adjustment
  if (groom.savings >= 6 * groom.monthlyIncome) {
    financialAdjustment += 0.20;
  } else if (groom.savings >= 3 * groom.monthlyIncome) {
    financialAdjustment += 0.10;
  }

  // Debt adjustment
  if (groom.debtAmount >= 6 * groom.monthlyIncome) {
    financialAdjustment -= 0.25;
  } else if (groom.debtAmount >= 3 * groom.monthlyIncome) {
    financialAdjustment -= 0.10;
  }

  // Apply financial adjustment
  baseMahr = baseMahr * (1 + financialAdjustment);
  
  const adjustedBeforeAlignment = baseMahr;

  // Step 5: Bride Expectation Alignment (Weighted average to pull result towards expectation)
  const averageExpectation = (bride.expectedMinMahr + bride.expectedMaxMahr) / 2;
  
  // Logic: If calculation is way off, blend it 70/30 with expectation
  // This prevents the calculator from being useless if expectations are vastly different from financial reality
  let alignedMahr = (baseMahr * 0.7) + (averageExpectation * 0.3);

  // Ensure it doesn't go below 0
  alignedMahr = Math.max(alignedMahr, 0);

  // Step 6: Final 3 Outputs
  const conservative = Math.round(alignedMahr * 0.8);
  const fair = Math.round(alignedMahr);
  const generous = Math.round(alignedMahr * 1.3);

  // Handle Split Logic
  let promptAmount = 0;
  let deferredAmount = 0;

  if (bride.mahrType === 'prompt') {
    promptAmount = fair;
    deferredAmount = 0;
  } else if (bride.mahrType === 'deferred') {
    promptAmount = 0;
    deferredAmount = fair;
  } else if (bride.mahrType === 'split') {
    promptAmount = Math.round(fair * (bride.promptPercentage / 100));
    deferredAmount = fair - promptAmount;
  }

  return {
    conservative,
    fair,
    generous,
    breakdown: {
      income: groom.monthlyIncome,
      preferenceFactor: factor,
      base: initialBase,
      cityAdjustment: cityMult,
      financialAdjustment: financialAdjustment,
      adjustedBeforeAlignment: adjustedBeforeAlignment,
      averageExpectation: averageExpectation,
      finalAligned: alignedMahr
    },
    promptAmount,
    deferredAmount
  };
};

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
