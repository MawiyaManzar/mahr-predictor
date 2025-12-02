import { JobStability, CityTier, BridePreference, MahrType } from './types';

export const CURRENCIES = ['USD', 'GBP', 'EUR', 'AED', 'SAR', 'INR', 'PKR'];

export const JOB_STABILITY_OPTIONS = [
  { value: JobStability.STABLE, label: 'Stable Full-time' },
  { value: JobStability.CONTRACT, label: 'Contract / Freelance' },
  { value: JobStability.STUDENT, label: 'Student / Entry Level' },
];

export const CITY_TIER_OPTIONS = [
  { value: CityTier.TIER1, label: 'Tier 1 (High Cost of Living)' },
  { value: CityTier.TIER2, label: 'Tier 2 (Medium Cost of Living)' },
  { value: CityTier.TIER3, label: 'Tier 3 (Low Cost of Living)' },
];

export const BRIDE_PREFERENCE_OPTIONS = [
  { value: BridePreference.SUNNAH, label: 'Sunnah / Simple', description: 'Prioritizes ease of marriage.' },
  { value: BridePreference.BALANCED, label: 'Balanced', description: 'Considers market standards and fairness.' },
  { value: BridePreference.GENEROUS, label: 'Generous', description: 'Reflects high appreciation or status.' },
];

export const MAHR_TYPE_OPTIONS = [
  { value: MahrType.PROMPT, label: 'Prompt (Mu’ajjal)', description: 'Paid in full at the time of Nikah.' },
  { value: MahrType.DEFERRED, label: 'Deferred (Mu’akhkhar)', description: 'Paid at a later agreed date.' },
  { value: MahrType.SPLIT, label: 'Split', description: 'Part prompt, part deferred.' },
];
