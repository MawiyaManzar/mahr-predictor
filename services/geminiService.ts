import { GoogleGenAI, Type } from "@google/genai";
import { AiInsight, CalculationResult, GroomProfile, BrideProfile } from '../types';

export const getMahrAdvice = async (
  groom: GroomProfile,
  bride: BrideProfile,
  result: CalculationResult
): Promise<AiInsight> => {
  
  if (!process.env.API_KEY) {
    return {
      explanation: "AI insights unavailable (API Key missing). The calculations above are based on standard financial ratios.",
      culturalNote: "Traditionally, Mahr is a gift to the bride and should be agreed upon with mutual kindness.",
      negotiationTip: "Open communication is key. Discuss expectations early."
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Context: A couple is using a Mahr Calculator.
    Groom Profile: Income ${groom.monthlyIncome} ${groom.currency}, Savings ${groom.savings}, Debt ${groom.debtAmount}, Stability: ${groom.jobStability}, City: ${groom.cityTier}.
    Bride Profile: Expectation ${bride.expectedMinMahr}-${bride.expectedMaxMahr} ${groom.currency}, Preference: ${bride.preference}.
    Calculated Results: Conservative ${result.conservative}, Fair ${result.fair}, Generous ${result.generous}.
    
    Task: Provide a JSON response with:
    1. explanation: A polite 2-sentence explanation of why the "Fair" amount was calculated, referencing the income and expectations.
    2. culturalNote: A brief Islamic/Cultural insight regarding Mahr (e.g. ease vs security).
    3. negotiationTip: A soft tip for the groom/bride/families to discuss this if there is a gap.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                explanation: { type: Type.STRING },
                culturalNote: { type: Type.STRING },
                negotiationTip: { type: Type.STRING }
            }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiInsight;

  } catch (error) {
    console.error("AI Generation Error", error);
    return {
      explanation: "Based on your financial inputs and local cost of living standards.",
      culturalNote: "Mahr is a token of respect and security.",
      negotiationTip: "Focus on the barakah (blessing) in the marriage."
    };
  }
};
