import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Calculator,
  ShieldCheck,
  ArrowUpRight,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface ToolsProps {
  onNavigateProjects?: (category?: 'residential' | 'commercial' | 'plots') => void;
  onOpenConsultation?: (topic?: string) => void;
}

type ToolTab = 'roi' | 'emi' | 'affordability';

export const Tools: React.FC<ToolsProps> = ({
  onNavigateProjects,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<ToolTab | null>('roi');

  // Tool refs for smooth scrolling when expanding
  const roiRef = useRef<HTMLDivElement>(null);
  const emiRef = useRef<HTMLDivElement>(null);
  const affRef = useRef<HTMLDivElement>(null);

  const handleToggleTab = (tab: ToolTab) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
      setTimeout(() => {
        const ref = tab === 'roi' ? roiRef : tab === 'emi' ? emiRef : affRef;
        if (ref.current) {
          const yOffset = -90;
          const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // =========================================================================
  // 1. ROI CALCULATOR STATE & MATH
  // =========================================================================
  const [roiPurchasePrice, setRoiPurchasePrice] = useState<number>(25000000); // 2.5 Cr
  const [roiMonthlyRent, setRoiMonthlyRent] = useState<number>(85000); // 85k / mo
  const [roiAppreciationRate, setRoiAppreciationRate] = useState<number>(8.5); // 8.5% p.a.
  const [roiRentalEscalation, setRoiRentalEscalation] = useState<number>(5.0); // 5% annual hike
  const [roiHoldingYears, setRoiHoldingYears] = useState<number>(5);
  const [roiAnnualExpense, setRoiAnnualExpense] = useState<number>(50000); // maintenance/tax

  const roiMath = useMemo(() => {
    const annualRentYear1 = roiMonthlyRent * 12;
    const grossRentalYield = (annualRentYear1 / roiPurchasePrice) * 100;
    const netRentalYield = ((annualRentYear1 - roiAnnualExpense) / roiPurchasePrice) * 100;

    let cumulativeRent = 0;
    let currentAnnualRent = annualRentYear1;
    for (let yr = 1; yr <= roiHoldingYears; yr++) {
      cumulativeRent += currentAnnualRent - roiAnnualExpense;
      currentAnnualRent *= 1 + roiRentalEscalation / 100;
    }

    const futurePropertyValue =
      roiPurchasePrice * Math.pow(1 + roiAppreciationRate / 100, roiHoldingYears);
    const capitalGains = futurePropertyValue - roiPurchasePrice;
    const totalGains = capitalGains + cumulativeRent;
    const overallROI = (totalGains / roiPurchasePrice) * 100;
    const cagr =
      (Math.pow((futurePropertyValue + cumulativeRent) / roiPurchasePrice, 1 / roiHoldingYears) - 1) *
      100;

    return {
      grossRentalYield,
      netRentalYield,
      cumulativeRent,
      futurePropertyValue,
      capitalGains,
      totalGains,
      overallROI,
      cagr,
    };
  }, [
    roiPurchasePrice,
    roiMonthlyRent,
    roiAppreciationRate,
    roiRentalEscalation,
    roiHoldingYears,
    roiAnnualExpense,
  ]);

  // =========================================================================
  // 2. EMI PLANNER STATE & MATH
  // =========================================================================
  const [emiPropertyValue, setEmiPropertyValue] = useState<number>(30000000); // 3.0 Cr
  const [emiDownPaymentPercent, setEmiDownPaymentPercent] = useState<number>(20); // 20%
  const [emiInterestRate, setEmiInterestRate] = useState<number>(8.5); // 8.5%
  const [emiTenureYears, setEmiTenureYears] = useState<number>(20); // 20 yrs

  const emiMath = useMemo(() => {
    const downPayment = (emiPropertyValue * emiDownPaymentPercent) / 100;
    const loanAmount = Math.max(0, emiPropertyValue - downPayment);
    const monthlyRate = emiInterestRate / 12 / 100;
    const totalMonths = emiTenureYears * 12;

    let monthlyEMI = 0;
    if (loanAmount > 0 && monthlyRate > 0 && totalMonths > 0) {
      monthlyEMI =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalRepayment = monthlyEMI * totalMonths;
    const totalInterest = Math.max(0, totalRepayment - loanAmount);
    const interestPercentage =
      totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;
    const principalPercentage =
      totalRepayment > 0 ? (loanAmount / totalRepayment) * 100 : 0;

    return {
      downPayment,
      loanAmount,
      monthlyEMI,
      totalRepayment,
      totalInterest,
      interestPercentage,
      principalPercentage,
    };
  }, [emiPropertyValue, emiDownPaymentPercent, emiInterestRate, emiTenureYears]);

  // =========================================================================
  // 3. PROPERTY AFFORDABILITY STATE & MATH
  // =========================================================================
  const [affMonthlyIncome, setAffMonthlyIncome] = useState<number>(350000); // 3.5 Lakhs / mo
  const [affExistingEmis, setAffExistingEmis] = useState<number>(35000); // 35k / mo
  const [affAvailableSavings, setAffAvailableSavings] = useState<number>(5000000); // 50 Lakhs
  const [affInterestRate, setAffInterestRate] = useState<number>(8.5);
  const [affTenureYears, setAffTenureYears] = useState<number>(20);
  const [affMaxFoir, setAffMaxFoir] = useState<number>(50); // 50% Banking standard

  const affMath = useMemo(() => {
    const maxPermissibleTotalEMI = (affMonthlyIncome * affMaxFoir) / 100;
    const availableMonthlyEmi = Math.max(0, maxPermissibleTotalEMI - affExistingEmis);

    const monthlyRate = affInterestRate / 12 / 100;
    const totalMonths = affTenureYears * 12;

    let maxEligibleLoan = 0;
    if (availableMonthlyEmi > 0 && monthlyRate > 0 && totalMonths > 0) {
      maxEligibleLoan =
        (availableMonthlyEmi * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
    }

    const conservativeLoan = maxEligibleLoan * 0.82;
    const maxPropertyBudget = affAvailableSavings + maxEligibleLoan;
    const comfortablePropertyBudget = affAvailableSavings + conservativeLoan;

    const projectedFoir = ((affExistingEmis + availableMonthlyEmi) / affMonthlyIncome) * 100;

    return {
      availableMonthlyEmi,
      maxEligibleLoan,
      conservativeLoan,
      maxPropertyBudget,
      comfortablePropertyBudget,
      projectedFoir,
    };
  }, [
    affMonthlyIncome,
    affExistingEmis,
    affAvailableSavings,
    affInterestRate,
    affTenureYears,
    affMaxFoir,
  ]);

  // Currency helper formatting in Crores & Lakhs
  const formatIndianCurrency = (num: number): string => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] pt-20 sm:pt-24 pb-28 md:pb-20 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            CLEAN HEADER TITLE
        ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight">
            Strategic Financial <span className="text-brand-purple">Tools</span>
          </h1>
        </div>

        {/* =========================================================================
            ACCORDION INLINE CARDS (Tools open directly below their button)
        ========================================================================= */}
        <div className="space-y-4 sm:space-y-6">
          {/* ==========================================
              TOOL 1: ROI CALCULATOR
          ========================================== */}
          <div
            ref={roiRef}
            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
              activeTab === 'roi'
                ? 'border-brand-purple/40 shadow-xl shadow-brand-purple/10 ring-1 ring-brand-purple/20'
                : 'border-gray-200/90 shadow-sm hover:border-gray-300'
            }`}
          >
            {/* Card Header */}
            <div
              onClick={() => handleToggleTab('roi')}
              className="p-5 sm:p-6 cursor-pointer select-none hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    activeTab === 'roi'
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'bg-brand-purple/10 text-brand-purple'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-950">ROI Calculator</h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                    Estimate potential returns from rental income and capital appreciation.
                  </p>
                  <div className="mt-3.5">
                    <button
                      type="button"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                        activeTab === 'roi'
                          ? 'bg-brand-purple text-white shadow-sm'
                          : 'bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple'
                      }`}
                    >
                      <span>Calculate ROI</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeTab === 'roi' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Tool Content Directly Below */}
            <AnimatePresence>
              {activeTab === 'roi' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-150 p-6 sm:p-8 bg-[#FAF9FC]/50"
                >
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Input Investment
                    </span>
                    <button
                      onClick={() => {
                        setRoiPurchasePrice(25000000);
                        setRoiMonthlyRent(85000);
                        setRoiAppreciationRate(8.5);
                        setRoiRentalEscalation(5.0);
                        setRoiHoldingYears(5);
                        setRoiAnnualExpense(50000);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-brand-purple transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Property Purchase Price</label>
                          <span className="font-extrabold text-brand-purple text-base">
                            {formatIndianCurrency(roiPurchasePrice)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={3000000}
                          max={200000000}
                          step={500000}
                          value={roiPurchasePrice}
                          onChange={(e) => setRoiPurchasePrice(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>₹30 Lakh</span>
                          <span>₹10 Cr</span>
                          <span>₹20 Cr</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Expected Rent</label>
                          <span className="font-extrabold text-gray-950 text-base">
                            ₹{roiMonthlyRent.toLocaleString('en-IN')} / mo
                          </span>
                        </div>
                        <input
                          type="range"
                          min={15000}
                          max={1000000}
                          step={5000}
                          value={roiMonthlyRent}
                          onChange={(e) => setRoiMonthlyRent(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>₹15,000</span>
                          <span>₹2.5 Lakh</span>
                          <span>₹10 Lakh</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Expected Capital Appreciation</label>
                          <span className="font-extrabold text-emerald-700 text-base">
                            {roiAppreciationRate}% p.a.
                          </span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={20}
                          step={0.5}
                          value={roiAppreciationRate}
                          onChange={(e) => setRoiAppreciationRate(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>2%</span>
                          <span>8.5% (Prime NCR)</span>
                          <span>20%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Holding Horizon</label>
                          <span className="font-extrabold text-gray-950 text-base">
                            {roiHoldingYears} {roiHoldingYears === 1 ? 'Year' : 'Years'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={20}
                          step={1}
                          value={roiHoldingYears}
                          onChange={(e) => setRoiHoldingYears(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>1 Year</span>
                          <span>5 Years</span>
                          <span>10 Years</span>
                          <span>20 Years</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                          <span className="text-[11px] font-bold text-gray-600 block mb-1">
                            Annual Rent Hike
                          </span>
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              value={roiRentalEscalation}
                              onChange={(e) => setRoiRentalEscalation(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900"
                            />
                            <span className="text-xs font-semibold text-gray-500">% p.a.</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                          <span className="text-[11px] font-bold text-gray-600 block mb-1">
                            Annual Maint. / Tax
                          </span>
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              value={roiAnnualExpense}
                              onChange={(e) => setRoiAnnualExpense(Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900"
                            />
                            <span className="text-xs font-semibold text-gray-500">₹/yr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clean Light Result Preview */}
                    <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-brand-purple/20 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                            Projected Wealth Summary
                          </h3>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            CAGR: {roiMath.cagr.toFixed(2)}%
                          </span>
                        </div>

                        <div className="mb-6">
                          <span className="text-xs font-semibold text-gray-500 block mb-1">
                            Estimated Future Property Value
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-brand-purple tracking-tight">
                            {formatIndianCurrency(roiMath.futurePropertyValue)}
                          </div>
                          <span className="text-xs text-emerald-700 font-bold mt-1 inline-flex items-center gap-1">
                            +{formatIndianCurrency(roiMath.capitalGains)} capital appreciation
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                              Gross Rental Yield
                            </span>
                            <span className="text-base sm:text-lg font-extrabold text-gray-950">
                              {roiMath.grossRentalYield.toFixed(2)}%
                            </span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                              Net Rental Yield
                            </span>
                            <span className="text-base sm:text-lg font-extrabold text-gray-950">
                              {roiMath.netRentalYield.toFixed(2)}%
                            </span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                              Cumulative Net Rent
                            </span>
                            <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                              {formatIndianCurrency(roiMath.cumulativeRent)}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                              Total Projected ROI
                            </span>
                            <span className="text-base sm:text-lg font-extrabold text-brand-purple">
                              {roiMath.overallROI.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80">
                          <div className="flex justify-between text-xs font-semibold text-gray-700">
                            <span>Capital Gains ({Math.round((roiMath.capitalGains / (roiMath.totalGains || 1)) * 100)}%)</span>
                            <span>Rental Cashflow ({Math.round((roiMath.cumulativeRent / (roiMath.totalGains || 1)) * 100)}%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden flex">
                            <div
                              style={{ width: `${(roiMath.capitalGains / (roiMath.totalGains || 1)) * 100}%` }}
                              className="h-full bg-brand-purple"
                            />
                            <div
                              style={{ width: `${(roiMath.cumulativeRent / (roiMath.totalGains || 1)) * 100}%` }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenConsultation?.('ROI Assessment')}
                        className="w-full py-3.5 px-4 rounded-2xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>Request Feasibility Assessment</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ==========================================
              TOOL 2: EMI PLANNER
          ========================================== */}
          <div
            ref={emiRef}
            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
              activeTab === 'emi'
                ? 'border-brand-purple/40 shadow-xl shadow-brand-purple/10 ring-1 ring-brand-purple/20'
                : 'border-gray-200/90 shadow-sm hover:border-gray-300'
            }`}
          >
            {/* Card Header */}
            <div
              onClick={() => handleToggleTab('emi')}
              className="p-5 sm:p-6 cursor-pointer select-none hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    activeTab === 'emi'
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'bg-brand-purple/10 text-brand-purple'
                  }`}
                >
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-950">EMI Planner</h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                    Understand your down payment, loan amount, monthly EMI and total interest.
                  </p>
                  <div className="mt-3.5">
                    <button
                      type="button"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                        activeTab === 'emi'
                          ? 'bg-brand-purple text-white shadow-sm'
                          : 'bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple'
                      }`}
                    >
                      <span>Plan EMI</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeTab === 'emi' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Tool Content Directly Below */}
            <AnimatePresence>
              {activeTab === 'emi' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-150 p-6 sm:p-8 bg-[#FAF9FC]/50"
                >
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Input Loan Parameters
                    </span>
                    <button
                      onClick={() => {
                        setEmiPropertyValue(30000000);
                        setEmiDownPaymentPercent(20);
                        setEmiInterestRate(8.5);
                        setEmiTenureYears(20);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-brand-purple transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Total Property Value</label>
                          <span className="font-extrabold text-brand-purple text-base">
                            {formatIndianCurrency(emiPropertyValue)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={2500000}
                          max={3000000000}
                          step={500000}
                          value={emiPropertyValue}
                          onChange={(e) => setEmiPropertyValue(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>₹25 Lakh</span>
                          <span>₹150 Cr</span>
                          <span>₹300 Cr</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">
                            Down Payment ({emiDownPaymentPercent}%)
                          </label>
                          <span className="font-extrabold text-gray-950 text-base">
                            {formatIndianCurrency(emiMath.downPayment)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={80}
                          step={5}
                          value={emiDownPaymentPercent}
                          onChange={(e) => setEmiDownPaymentPercent(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>10%</span>
                          <span>20% (Recommended)</span>
                          <span>80%</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-gray-600 block">Required Loan Amount</span>
                          <span className="text-base font-black text-brand-purple">
                            {formatIndianCurrency(emiMath.loanAmount)}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple">
                          {100 - emiDownPaymentPercent}% LTV
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Bank Interest Rate</label>
                          <span className="font-extrabold text-blue-700 text-base">
                            {emiInterestRate.toFixed(2)}% p.a.
                          </span>
                        </div>
                        <input
                          type="range"
                          min={6.5}
                          max={14.0}
                          step={0.1}
                          value={emiInterestRate}
                          onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>6.50%</span>
                          <span>8.50% (Current Prime)</span>
                          <span>14.0%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Loan Tenure</label>
                          <span className="font-extrabold text-gray-950 text-base">
                            {emiTenureYears} Years ({emiTenureYears * 12} Months)
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={30}
                          step={1}
                          value={emiTenureYears}
                          onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>5 Yrs</span>
                          <span>15 Yrs</span>
                          <span>20 Yrs</span>
                          <span>30 Yrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Clean Light Result Preview */}
                    <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-brand-purple/20 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                            Loan Repayment Summary
                          </h3>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            {emiInterestRate}% @ {emiTenureYears} Yrs
                          </span>
                        </div>

                        <div className="mb-6">
                          <span className="text-xs font-semibold text-gray-500 block mb-1">
                            Estimated Mortgage EMI
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-brand-purple tracking-tight">
                            ₹{Math.round(emiMath.monthlyEMI).toLocaleString('en-IN')}{' '}
                            <span className="text-sm font-semibold text-gray-500">/ mo</span>
                          </div>
                        </div>

                        <div className="space-y-2.5 mb-6">
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Principal Loan Amount</span>
                            <span className="text-sm font-bold text-gray-950">
                              {formatIndianCurrency(emiMath.loanAmount)}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Total Interest Payable</span>
                            <span className="text-sm font-bold text-amber-700">
                              {formatIndianCurrency(emiMath.totalInterest)}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Total Repayment (P + I)</span>
                            <span className="text-sm font-bold text-emerald-700">
                              {formatIndianCurrency(emiMath.totalRepayment)}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Upfront Down Payment</span>
                            <span className="text-sm font-bold text-brand-purple">
                              {formatIndianCurrency(emiMath.downPayment)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80">
                          <div className="flex justify-between text-xs font-semibold text-gray-700">
                            <span>Principal ({emiMath.principalPercentage.toFixed(1)}%)</span>
                            <span>Interest ({emiMath.interestPercentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden flex">
                            <div
                              style={{ width: `${emiMath.principalPercentage}%` }}
                              className="h-full bg-brand-purple"
                            />
                            <div
                              style={{ width: `${emiMath.interestPercentage}%` }}
                              className="h-full bg-amber-400"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenConsultation?.('Free Consultation')}
                        className="w-full py-3.5 px-4 rounded-2xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>Connect For Free Consultation</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ==========================================
              TOOL 3: PROPERTY AFFORDABILITY
          ========================================== */}
          <div
            ref={affRef}
            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
              activeTab === 'affordability'
                ? 'border-brand-purple/40 shadow-xl shadow-brand-purple/10 ring-1 ring-brand-purple/20'
                : 'border-gray-200/90 shadow-sm hover:border-gray-300'
            }`}
          >
            {/* Card Header */}
            <div
              onClick={() => handleToggleTab('affordability')}
              className="p-5 sm:p-6 cursor-pointer select-none hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    activeTab === 'affordability'
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'bg-brand-purple/10 text-brand-purple'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-950">Property Affordability</h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                    Find a realistic property budget based on your income, existing commitments and available savings.
                  </p>
                  <div className="mt-3.5">
                    <button
                      type="button"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                        activeTab === 'affordability'
                          ? 'bg-brand-purple text-white shadow-sm'
                          : 'bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple'
                      }`}
                    >
                      <span>Check Affordability</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeTab === 'affordability' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Tool Content Directly Below */}
            <AnimatePresence>
              {activeTab === 'affordability' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-150 p-6 sm:p-8 bg-[#FAF9FC]/50"
                >
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Input Income & Liabilities
                    </span>
                    <button
                      onClick={() => {
                        setAffMonthlyIncome(350000);
                        setAffExistingEmis(35000);
                        setAffAvailableSavings(5000000);
                        setAffInterestRate(8.5);
                        setAffTenureYears(20);
                        setAffMaxFoir(50);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-brand-purple transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Gross Household Income</label>
                          <span className="font-extrabold text-brand-purple text-base shrink-0">
                            {affMonthlyIncome >= 10000000
                              ? `${formatIndianCurrency(affMonthlyIncome)} / mo`
                              : `₹${affMonthlyIncome.toLocaleString('en-IN')} / mo`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={50000}
                          max={100000000}
                          step={50000}
                          value={affMonthlyIncome}
                          onChange={(e) => setAffMonthlyIncome(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>₹50,000</span>
                          <span>₹5 Cr</span>
                          <span>₹10 Cr</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Existing Commitments (EMIs, Loans)</label>
                          <span className="font-extrabold text-gray-950 text-base shrink-0">
                            {affExistingEmis >= 10000000
                              ? `${formatIndianCurrency(affExistingEmis)} / mo`
                              : `₹${affExistingEmis.toLocaleString('en-IN')} / mo`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={5000000}
                          step={10000}
                          value={affExistingEmis}
                          onChange={(e) => setAffExistingEmis(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>₹0 (Zero debt)</span>
                          <span>₹25 Lakh</span>
                          <span>₹50 Lakh</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <label className="font-bold text-gray-800">Available Savings for Down Payment</label>
                          <span className="font-extrabold text-emerald-700 text-base">
                            {formatIndianCurrency(affAvailableSavings)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={500000}
                          max={100000000}
                          step={500000}
                          value={affAvailableSavings}
                          onChange={(e) => setAffAvailableSavings(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                          <span>₹5 Lakh</span>
                          <span>₹2.5 Cr</span>
                          <span>₹10 Cr</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                          <span className="text-[11px] font-bold text-gray-600 block mb-1">
                            Tenure Preference
                          </span>
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              value={affTenureYears}
                              onChange={(e) => setAffTenureYears(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900"
                            />
                            <span className="text-xs font-semibold text-gray-500">Years</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                          <span className="text-[11px] font-bold text-gray-600 block mb-1">
                            Interest Rate
                          </span>
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              step={0.1}
                              value={affInterestRate}
                              onChange={(e) => setAffInterestRate(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900"
                            />
                            <span className="text-xs font-semibold text-gray-500">% p.a.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clean Light Result Preview */}
                    <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-brand-purple/20 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                            Recommended Budget
                          </h3>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            Safe EMI Limit: {affMath.projectedFoir.toFixed(0)}%
                          </span>
                        </div>

                        <div className="mb-6">
                          <span className="text-xs font-semibold text-gray-500 block mb-1">
                            Recommended Budget
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-brand-purple tracking-tight">
                            {formatIndianCurrency(affMath.maxPropertyBudget)}
                          </div>
                          <span className="text-xs text-gray-600 font-semibold mt-1 block">
                            Comfortable safe sweet-spot: {formatIndianCurrency(affMath.comfortablePropertyBudget)}
                          </span>
                        </div>

                        <div className="space-y-2.5 mb-6">
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Max Eligible Bank Loan</span>
                            <span className="text-sm font-bold text-gray-950">
                              {formatIndianCurrency(affMath.maxEligibleLoan)}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Down Payment Funded</span>
                            <span className="text-sm font-bold text-emerald-700">
                              {formatIndianCurrency(affAvailableSavings)}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">Max Disposable EMI</span>
                            <span className="text-sm font-bold text-brand-purple">
                              ₹{Math.round(affMath.availableMonthlyEmi).toLocaleString('en-IN')} / mo
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-2.5 mb-6">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                            With your current obligations, an EMI of ₹{Math.round(affMath.availableMonthlyEmi).toLocaleString('en-IN')} stays fully within bank eligibility guidelines.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => onNavigateProjects?.('residential')}
                          className="py-3 px-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>Explore Projects</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            onOpenConsultation?.(
                              `Affordability (${formatIndianCurrency(affMath.maxPropertyBudget)})`
                            )
                          }
                          className="py-3 px-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>Portfolio Advisory</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
