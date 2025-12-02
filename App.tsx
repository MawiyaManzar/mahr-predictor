import React, { useState, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  HeartHandshake, 
  Banknote, 
  MapPin, 
  Scale, 
  Calculator, 
  Share2,
  RefreshCw,
  Sparkles,
  Loader2,
  BookOpen
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import html2canvas from 'html2canvas';

import { GroomProfile, BrideProfile, JobStability, CityTier, BridePreference, MahrType, CalculationResult, AiInsight } from './types';
import { CURRENCIES, JOB_STABILITY_OPTIONS, CITY_TIER_OPTIONS, BRIDE_PREFERENCE_OPTIONS, MAHR_TYPE_OPTIONS } from './constants';
import { calculateMahr, formatCurrency } from './services/mahrLogic';
import { getMahrAdvice } from './services/geminiService';
import { Input } from './components/Input';
import { Select } from './components/Select';

// Initial States
const INITIAL_GROOM: GroomProfile = {
  monthlyIncome: 0,
  savings: 0,
  monthlyExpenses: 0,
  debtAmount: 0,
  jobStability: JobStability.STABLE,
  cityTier: CityTier.TIER2,
  currency: 'USD'
};

const INITIAL_BRIDE: BrideProfile = {
  expectedMinMahr: 0,
  expectedMaxMahr: 0,
  preference: BridePreference.BALANCED,
  mahrType: MahrType.PROMPT,
  promptPercentage: 50
};

// Colors for Chart (Deep Emerald & Soft Gold)
const COLORS = ['#0F5F4A', '#D4A373']; 

export default function App() {
  const [step, setStep] = useState<number>(0);
  const [groomData, setGroomData] = useState<GroomProfile>(INITIAL_GROOM);
  const [brideData, setBrideData] = useState<BrideProfile>(INITIAL_BRIDE);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [scholarMode, setScholarMode] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleGroomChange = (field: keyof GroomProfile, value: any) => {
    setGroomData(prev => ({ ...prev, [field]: value }));
  };

  const handleBrideChange = (field: keyof BrideProfile, value: any) => {
    setBrideData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const performCalculation = async () => {
    const res = calculateMahr(groomData, brideData);
    setResult(res);
    setStep(4); // Move to loading/result
    setScholarMode(false); // Reset mode
    
    // Fetch AI Advice
    setLoadingAi(true);
    const insight = await getMahrAdvice(groomData, brideData, res);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const handleShare = async () => {
    if (!resultsRef.current) return;
    setIsSharing(true);
    
    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#FFF9F0', // Warm cream background
        scale: 2, // Better quality
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        // Mobile Native Share
        if (navigator.share) {
          try {
            const file = new File([blob], 'mahr-calculation.png', { type: 'image/png' });
            await navigator.share({
              title: 'Mahr Calculation',
              text: 'Here is our estimated Mahr calculation based on financial fairness and sunnah.',
              files: [file],
            });
          } catch (err) {
             // Fallback if files sharing not supported or user cancelled
             const link = document.createElement('a');
             link.download = 'mahr-calculation.png';
             link.href = canvas.toDataURL();
             link.click();
          }
        } else {
          // Desktop Download
          const link = document.createElement('a');
          link.download = 'mahr-calculation.png';
          link.href = canvas.toDataURL();
          link.click();
        }
      });
    } catch (error) {
      console.error('Share failed', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Render Steps
  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pb-12">
      <div className="mb-6 animate-fade-in-up">
        <HeartHandshake className="w-16 h-16 text-mahr-emerald" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-mahr-emerald mb-4">
        مهر Predictor
      </h1>
      <p className="text-lg text-mahr-charcoal/80 max-w-xl mb-8 leading-relaxed font-sans">
        Find a fair, culturally-aligned Mahr estimate. We blend financial reality with prophetic wisdom to help you start your journey with clarity and barakah.
      </p>
      <button 
        onClick={nextStep}
        className="group bg-mahr-emerald hover:bg-emerald-900 text-white text-lg font-medium py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mb-20 font-sans"
      >
        Start Prediction
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Islamic Principles Section */}
      <div className="w-full text-left max-w-4xl border-t border-mahr-gold/20 pt-16">
         <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center p-3 mb-4">
             <BookOpen className="w-6 h-6 text-mahr-emerald" />
           </div>
           <h2 className="text-3xl font-serif font-bold text-mahr-emerald">Built on Islamic Principles</h2>
           <p className="text-mahr-charcoal/70 mt-3 max-w-2xl mx-auto font-sans">
             This tool does not issue fatwas. It organizes financial reality and expectations to facilitate a fair agreement (Ridā).
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Card 1: Groom's Ability */}
           <div className="bg-white p-8 rounded-2xl border border-mahr-gold/20 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="font-serif font-bold text-xl text-mahr-charcoal mb-3 flex items-center gap-3">
               <Scale className="w-5 h-5 text-mahr-gold" />
               Groom's Ability (Tāqa)
             </h3>
             <p className="text-sm text-mahr-charcoal/80 leading-relaxed font-sans">
               The Qur’an (65:7) emphasizes giving according to one's means. Our model uses income and savings data to ensure the suggestion is affordable and does not burden the groom.
             </p>
           </div>

           {/* Card 2: Bride's Right */}
           <div className="bg-white p-8 rounded-2xl border border-mahr-gold/20 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="font-serif font-bold text-xl text-mahr-charcoal mb-3 flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-mahr-gold" />
               Bride's Right (Haq)
             </h3>
             <p className="text-sm text-mahr-charcoal/80 leading-relaxed font-sans">
               Islam gives the bride full freedom to request what she deems appropriate. The calculator anchors predictions to her minimum and maximum expectations to respect her agency.
             </p>
           </div>

           {/* Card 3: Custom (Urf) */}
           <div className="bg-white p-8 rounded-2xl border border-mahr-gold/20 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="font-serif font-bold text-xl text-mahr-charcoal mb-3 flex items-center gap-3">
               <MapPin className="w-5 h-5 text-mahr-gold" />
               Regional Custom (Urf)
             </h3>
             <p className="text-sm text-mahr-charcoal/80 leading-relaxed font-sans">
               Islamic law acknowledges local custom (ʿurf). We adjust calculations based on the cost of living in your region to ensure relevance, without contradicting Shariah.
             </p>
           </div>

           {/* Card 4: No Standardization */}
           <div className="bg-white p-8 rounded-2xl border border-mahr-gold/20 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="font-serif font-bold text-xl text-mahr-charcoal mb-3 flex items-center gap-3">
               <HeartHandshake className="w-5 h-5 text-mahr-gold" />
               Mutual Consent
             </h3>
             <p className="text-sm text-mahr-charcoal/80 leading-relaxed font-sans">
               There is no fixed "Islamic number" for Mahr. This tool provides ranges (Simple, Balanced, Generous) to structure the conversation, leaving the final decision entirely to the couple.
             </p>
           </div>
         </div>

         <div className="mt-12 bg-mahr-emerald/5 border border-mahr-emerald/10 rounded-xl p-6 text-center">
           <p className="text-base text-mahr-emerald italic font-medium font-serif">
             "The most blessed marriage is the one with the least burden." — Hadith
           </p>
         </div>
      </div>
    </div>
  );

  const renderGroomForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-mahr-emerald">Financial Profile</h2>
        <p className="text-mahr-charcoal/60 font-sans">Help us understand the financial baseline of your fiance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Select
          label="Currency"
          value={groomData.currency}
          onChange={(e) => handleGroomChange('currency', e.target.value)}
          options={CURRENCIES.map(c => ({ value: c, label: c }))}
        />
        <Select
          label="Job Stability"
          value={groomData.jobStability}
          onChange={(e) => handleGroomChange('jobStability', e.target.value)}
          options={JOB_STABILITY_OPTIONS}
        />
      </div>

      <Input
        label="Monthly Income"
        type="number"
        value={groomData.monthlyIncome || ''}
        onChange={(e) => handleGroomChange('monthlyIncome', parseFloat(e.target.value))}
        placeholder="e.g. 5000"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Total Savings"
          type="number"
          value={groomData.savings || ''}
          onChange={(e) => handleGroomChange('savings', parseFloat(e.target.value))}
        />
        <Input
          label="Total Debt"
          type="number"
          value={groomData.debtAmount || ''}
          onChange={(e) => handleGroomChange('debtAmount', parseFloat(e.target.value))}
          subtext="Student loans, credit card debt, etc."
        />
      </div>

      <Select
        label="City / Region Cost of Living"
        value={groomData.cityTier}
        onChange={(e) => handleGroomChange('cityTier', e.target.value)}
        options={CITY_TIER_OPTIONS}
      />

      <div className="flex justify-end pt-4">
        <button 
          onClick={nextStep}
          disabled={!groomData.monthlyIncome}
          className="bg-mahr-emerald disabled:opacity-50 text-white py-3 px-8 rounded-full flex items-center gap-2 hover:bg-emerald-900 transition-colors font-sans font-medium"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderBrideForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-mahr-emerald">Expectations & Preferences</h2>
        <p className="text-mahr-charcoal/60 font-sans">Aligning with the bride's perspective.</p>
      </div>

      <div className="bg-mahr-beige/50 p-6 rounded-xl border border-mahr-gold/20">
        <label className="block text-sm font-medium text-mahr-charcoal mb-4 font-sans">Mahr Range Expectation ({groomData.currency})</label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Minimum"
            type="number"
            value={brideData.expectedMinMahr || ''}
            onChange={(e) => handleBrideChange('expectedMinMahr', parseFloat(e.target.value))}
          />
          <Input
            label="Maximum"
            type="number"
            value={brideData.expectedMaxMahr || ''}
            onChange={(e) => handleBrideChange('expectedMaxMahr', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-mahr-charcoal font-sans">Preferred Approach</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BRIDE_PREFERENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleBrideChange('preference', opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                brideData.preference === opt.value
                  ? 'border-mahr-emerald bg-mahr-emerald/5 ring-1 ring-mahr-emerald'
                  : 'border-slate-200 hover:border-mahr-gold/50 bg-white'
              }`}
            >
              <div className="font-semibold text-mahr-charcoal mb-1 font-sans">{opt.label}</div>
              <div className="text-xs text-mahr-charcoal/60 leading-tight font-sans">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button 
          onClick={prevStep}
          className="text-mahr-charcoal/70 hover:text-mahr-charcoal py-3 px-6 flex items-center gap-2 font-sans"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!brideData.expectedMinMahr}
          className="bg-mahr-emerald disabled:opacity-50 text-white py-3 px-8 rounded-full flex items-center gap-2 hover:bg-emerald-900 transition-colors font-sans font-medium"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderSummaryForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-mahr-emerald">Payment Structure</h2>
        <p className="text-mahr-charcoal/60 font-sans">How should the Mahr be paid?</p>
      </div>

      <div className="space-y-3">
        {MAHR_TYPE_OPTIONS.map((opt) => (
          <div 
            key={opt.value}
            onClick={() => handleBrideChange('mahrType', opt.value)}
            className={`cursor-pointer p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
              brideData.mahrType === opt.value
                ? 'border-mahr-emerald bg-mahr-emerald/5'
                : 'border-slate-200 hover:bg-mahr-beige/50 bg-white'
            }`}
          >
            <div>
              <div className="font-semibold text-mahr-charcoal font-sans">{opt.label}</div>
              <div className="text-sm text-mahr-charcoal/60 font-sans">{opt.description}</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              brideData.mahrType === opt.value ? 'border-mahr-emerald' : 'border-slate-300'
            }`}>
              {brideData.mahrType === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-mahr-emerald" />}
            </div>
          </div>
        ))}
      </div>

      {brideData.mahrType === MahrType.SPLIT && (
        <div className="animate-fade-in bg-mahr-beige/50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-mahr-charcoal mb-2 font-sans">
            Percentage to pay immediately: {brideData.promptPercentage}%
          </label>
          <input 
            type="range" 
            min="10" 
            max="90" 
            step="10"
            value={brideData.promptPercentage} 
            onChange={(e) => handleBrideChange('promptPercentage', parseInt(e.target.value))}
            className="w-full accent-mahr-emerald"
          />
          <div className="flex justify-between text-xs text-mahr-charcoal/50 mt-1 font-sans">
            <span>More Deferred</span>
            <span>More Prompt</span>
          </div>
        </div>
      )}

      <div className="mt-8 bg-mahr-gold/10 border border-mahr-gold/30 rounded-lg p-4 flex gap-3">
        <Scale className="w-6 h-6 text-mahr-gold flex-shrink-0" />
        <p className="text-sm text-mahr-emerald font-sans">
          Almost done. We will now combine your financial data with the preference settings to calculate the recommended range.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button 
          onClick={prevStep}
          className="text-mahr-charcoal/70 hover:text-mahr-charcoal py-3 px-6 flex items-center gap-2 font-sans"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={performCalculation}
          className="bg-mahr-emerald text-white py-3 px-10 rounded-full flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-lg shadow-mahr-emerald/20 font-sans font-medium"
        >
          <Calculator className="w-4 h-4" /> Calculate Mahr
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!result) return null;

    const dataForChart = [
      { name: 'Prompt', value: result.promptAmount || result.fair },
      { name: 'Deferred', value: result.deferredAmount || 0 },
    ].filter(d => d.value > 0);

    return (
      <div className="space-y-8 animate-fade-in max-w-2xl mx-auto" ref={resultsRef}>
        <div className="text-center space-y-2">
          <div className="mb-2">
            <HeartHandshake className="w-8 h-8 text-mahr-emerald mx-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-mahr-emerald">Recommended Mahr</h2>
          <p className="text-mahr-charcoal/60 font-medium font-sans">Based on {groomData.currency} and {groomData.cityTier} living standards</p>
        </div>

        {/* Stacked Cards Layout */}
        <div className="flex flex-col gap-6">
          
          {/* Simple / Conservative */}
          <div className="bg-mahr-beige rounded-2xl p-6 border border-mahr-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-mahr-emerald mb-1">
                 <span className="text-xl">🕊️</span>
                 <h3 className="font-serif font-bold text-xl">Simple Mahr</h3>
              </div>
              <p className="text-sm text-mahr-charcoal/80 font-sans">A modest option for financial ease.</p>
            </div>
            <div className="text-2xl font-sans font-bold text-mahr-charcoal">
               {formatCurrency(result.conservative, groomData.currency)}
            </div>
          </div>

          {/* Balanced / Fair - Highlighted */}
          {/* Changes: Emerald Background, White Text, Gold Border */}
          <div className="relative bg-mahr-emerald rounded-3xl p-8 border-2 border-mahr-gold shadow-xl transform md:scale-105 z-10 my-4 text-white">
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-mahr-gold text-white text-xs tracking-wide px-4 py-1.5 rounded-full font-medium shadow-sm font-sans">
                Balanced Option
             </div>
             <div className="flex flex-col items-center text-center gap-2">
                <div className="mb-2 opacity-90">
                    <span className="text-3xl">💍</span>
                </div>
                <h3 className="font-serif font-bold text-3xl text-white">Balanced Mahr</h3>
                
                {/* Price uses font-sans (Inter) */}
                <div className="text-5xl font-sans font-bold text-mahr-beige py-3">
                    {formatCurrency(result.fair, groomData.currency)}
                </div>
                
                <p className="text-mahr-cream/80 max-w-xs mx-auto font-sans">
                    Aligns best with income and expectations.
                </p>
             </div>
          </div>

          {/* Generous */}
          <div className="bg-mahr-rose rounded-2xl p-6 border border-mahr-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-mahr-charcoal mb-1">
                 <span className="text-xl">🌙</span>
                 <h3 className="font-serif font-bold text-xl">Generous Mahr</h3>
              </div>
              <p className="text-sm text-mahr-charcoal/80 font-sans">A higher amount if finances allow comfortably.</p>
            </div>
            <div className="text-2xl font-sans font-bold text-mahr-charcoal">
               {formatCurrency(result.generous, groomData.currency)}
            </div>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Text Analysis */}
          <div className="space-y-4">
             {/* AI Insight Card */}
            <div className="bg-white border border-mahr-gold/20 rounded-xl p-6 shadow-sm relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-mahr-gold" />
                <h3 className="font-bold text-mahr-charcoal font-serif">Insight & Wisdom</h3>
              </div>
              
              {loadingAi ? (
                 <div className="flex flex-col items-center justify-center py-6 text-mahr-charcoal/50 gap-2">
                   <Loader2 className="w-6 h-6 animate-spin" />
                   <span className="text-sm font-sans">Consulting wisdom...</span>
                 </div>
              ) : aiInsight ? (
                <div className="space-y-3 text-sm text-mahr-charcoal/80 font-sans">
                  <p><span className="font-semibold text-mahr-emerald">Reasoning:</span> {aiInsight.explanation}</p>
                  <p><span className="font-semibold text-mahr-emerald">Cultural Note:</span> {aiInsight.culturalNote}</p>
                  <div className="bg-mahr-cream p-3 rounded-lg text-mahr-emerald mt-2 text-xs italic border border-mahr-beige">
                    💡 Tip: {aiInsight.negotiationTip}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-mahr-charcoal/50 italic font-sans">Insights unavailable.</div>
              )}
            </div>

            <div className="bg-white border border-mahr-gold/20 rounded-xl p-6">
              <h3 className="font-bold text-mahr-charcoal mb-4 flex items-center gap-2 font-serif">
                <Banknote className="w-5 h-5 text-mahr-emerald" /> Payment Structure
              </h3>
              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center p-3 bg-mahr-cream rounded-lg">
                  <span className="text-mahr-charcoal/80">Prompt (Mu’ajjal)</span>
                  <span className="font-bold text-mahr-emerald">{formatCurrency(result.promptAmount || 0, groomData.currency)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-mahr-cream rounded-lg">
                  <span className="text-mahr-charcoal/80">Deferred (Mu’akhkhar)</span>
                  <span className="font-bold text-mahr-gold">{formatCurrency(result.deferredAmount || 0, groomData.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {(result.promptAmount || 0) > 0 && (
            <div className="bg-white border border-mahr-gold/20 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="font-bold text-mahr-charcoal mb-2 w-full text-left font-serif">Payment Split</h3>
              <div className="w-full h-[250px] font-sans">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataForChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dataForChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(Number(value), groomData.currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 text-sm text-mahr-charcoal/80 font-sans">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-mahr-emerald"></div> Prompt
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-mahr-gold"></div> Deferred
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scholar Mode Toggle */}
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setScholarMode(!scholarMode)}
            className="flex items-center gap-2 text-sm text-mahr-charcoal/50 hover:text-mahr-emerald transition-colors font-sans"
          >
            <BookOpen className="w-4 h-4" /> 
            {scholarMode ? 'Hide Scholar Breakdown' : 'Aalim / Scholar Mode (Check Logic)'}
          </button>
        </div>

        {/* Scholar Mode Card */}
        {scholarMode && (
          <div className="bg-slate-800 text-slate-100 p-6 rounded-xl mt-4 font-mono text-sm shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 border-b border-slate-700 pb-2">
              🎓 Calculation Logic Breakdown
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Monthly Income</span>
                <span>{formatCurrency(result.breakdown.income, groomData.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>× Preference Factor ({brideData.preference})</span>
                <span>{result.breakdown.preferenceFactor}x</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-1">
                <span>= Base Calculation</span>
                <span>{formatCurrency(result.breakdown.base, groomData.currency)}</span>
              </div>
              
              <div className="flex justify-between text-slate-400">
                <span>× City Adjustment ({groomData.cityTier})</span>
                <span>{result.breakdown.cityAdjustment}x</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>+ Financial Health Adj. (Savings/Debt)</span>
                <span>{(result.breakdown.financialAdjustment * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between border-t border-slate-700 pt-1">
                <span>= Adjusted Mahr (Pre-alignment)</span>
                <span>{formatCurrency(result.breakdown.adjustedBeforeAlignment, groomData.currency)}</span>
              </div>
              
              <div className="py-2 text-center text-xs text-slate-500 my-2 bg-slate-900 rounded">
                --- Alignment with Expectations ---
              </div>
              
              <div className="flex justify-between text-slate-400">
                <span>Formula Weight (70%)</span>
                <span>{formatCurrency(result.breakdown.adjustedBeforeAlignment * 0.7, groomData.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bride Expectation Avg Weight (30%)</span>
                <span>{formatCurrency(result.breakdown.averageExpectation * 0.3, groomData.currency)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-emerald-400 border-t border-slate-600 pt-2 text-lg">
                <span>= Final "Fair" Estimate</span>
                <span>{formatCurrency(result.fair, groomData.currency)}</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-500 italic">
              * This logic serves as a guideline, not a Shariah ruling.
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 pt-6 justify-center">
           <button 
            onClick={() => {
                setStep(0);
                setResult(null);
                setAiInsight(null);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-mahr-charcoal/20 text-mahr-charcoal/70 hover:bg-white transition-colors font-sans"
           >
             <RefreshCw className="w-4 h-4" /> Start Over
           </button>
           <button 
             onClick={handleShare}
             disabled={isSharing}
             className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-mahr-emerald text-white hover:bg-emerald-900 transition-colors shadow-lg disabled:opacity-70 font-sans font-medium"
           >
             {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
             Share Results
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-mahr-cream font-sans selection:bg-mahr-rose selection:text-mahr-emerald">
      {/* Header */}
      <nav className="bg-mahr-cream/90 backdrop-blur-sm border-b border-mahr-gold/20 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif text-xl font-bold text-mahr-emerald">
            <HeartHandshake className="w-6 h-6" />
            <span>MahrCalc</span>
          </div>
          {step > 0 && step < 5 && (
            <div className="text-sm font-medium text-mahr-charcoal/40 font-sans">
              Step {step} of 4
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {step === 0 && renderLanding()}
        
        {step > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-mahr-gold/10 p-6 md:p-10 transition-all duration-500 ease-in-out">
            {step === 1 && renderGroomForm()}
            {step === 2 && renderBrideForm()}
            {step === 3 && renderSummaryForm()}
            {step === 4 && renderResults()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-mahr-charcoal/40 text-sm font-sans">
        <p>© 2025 Mahr Predictor. Designed for ease By Mawiya Manzar & Irfan Zaki.</p>
      </footer>
    </div>
  );
}