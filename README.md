# Mahr Predictor

Mahr Predictor helps Muslim couples arrive at a **fair, realistic, and Shariah-conscious mahr** by combining financial data with the bride’s expectations and local cost of living.

---

## Why this exists (the problem)

In many marriages today, **mahr is either guessed, copied from culture, or set at an unrealistic number**.  
Often:

- Mahr is treated as a **mere formality** or an impossible number that no one expects to actually pay.
- Decisions are made **without looking at real finances**, cost of living, or the bride’s true expectations.
- Couples feel **awkward or confused** talking about money, and don’t know what is “too low” or “too high”.

Mahr Predictor exists to **support honest, calm conversations** by giving a **clear, numbers-based starting point** that respects both Islamic principles and real-world constraints.

---

## How the calculator works (simple explanation)

At a high level, the app:

1. **Looks at the groom’s situation**
   - Monthly income  
   - Savings and debts  
   - City / cost-of-living level  

2. **Respects the bride’s expectations**
   - Her minimum and maximum desired mahr  
   - Her preference: *simple*, *balanced*, or *more generous*  

3. **Combines both sides into a suggested range**
   - Starts from a base amount (linked to monthly income and her preference).  
   - Adjusts for city tier (expensive vs. more affordable regions).  
   - Adjusts slightly up or down based on savings and debt (not to punish debt, but to keep things realistic).  
   - Then **blends 70% “financial reality” with 30% “bride’s expectation average”** so the result is grounded but still respects her stated range.

4. **Outputs three easy-to-understand options**
   - **Simple**: around 80% of the fair amount (more conservative).  
   - **Balanced**: the central “fair” recommendation.  
   - **Generous**: around 130% of the fair amount (if finances comfortably allow).  

5. **Lets you choose how to pay**
   - All prompt (now), all deferred (later), or split (percentage now and the rest deferred).  

> The tool is **not a fatwa** and does **not** replace a scholar.  
> It is a **conversation helper**: a way to see numbers clearly so couples and families can decide together with knowledge and ihsan.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
