import React, { useState, useEffect } from 'react';
import { getVehicles } from '../services/vehicleService';
import type { Vehicle } from '../services/vehicleService';
import { calculateEstimatedInstallment, formatZAR } from '../services/financeCalculationService';

export interface VwCatalogueProps {
  onSelectVehicleForFinance?: (vehicle: Vehicle) => void;
}

export const VwCatalogue: React.FC<VwCatalogueProps> = ({
  onSelectVehicleForFinance,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  const [activeCalculatorVehicle, setActiveCalculatorVehicle] = useState<Vehicle | null>(null);

  // Custom calculator state
  const [depositPct, setDepositPct] = useState<number>(0);
  const [termMonths, setTermMonths] = useState<number>(72);
  const [balloonPct, setBalloonPct] = useState<number>(0);

  const modelTabs = ['All', 'Polo', 'Polo GTI', 'T-Cross', 'Golf', 'Tiguan', 'Polo Vivo'];

  useEffect(() => {
    async function loadStock() {
      setLoading(true);
      const data = await getVehicles({
        model: selectedModel,
        transmission: selectedTransmission,
      });
      setVehicles(data);
      setLoading(false);
    }
    loadStock();
  }, [selectedModel, selectedTransmission]);

  const activeCalcResult = activeCalculatorVehicle
    ? calculateEstimatedInstallment({
        vehiclePrice: activeCalculatorVehicle.price,
        depositPercentage: depositPct,
        loanTermMonths: termMonths,
        balloonPercentage: balloonPct,
      })
    : null;

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-400">
              Live Dealership Stock • Single Source of Truth
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Volkswagen Certified Inventory
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Inspected pre-owned and demo VW models with instant digital finance pre-qualification through WesBank, Absa, Standard Bank, and MFC.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTransmission}
            onChange={(e) => setSelectedTransmission(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-xs rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-white"
          >
            <option value="All">All Transmissions</option>
            <option value="Automatic">Automatic / DSG</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Model Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {modelTabs.map((model) => (
          <button
            key={model}
            type="button"
            onClick={() => setSelectedModel(model)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedModel === model
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-wider font-semibold">Synchronizing Live Stock...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
          <p className="text-sm">No vehicles match the selected criteria.</p>
          <button
            type="button"
            onClick={() => { setSelectedModel('All'); setSelectedTransmission('All'); }}
            className="mt-4 px-4 py-2 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="bg-[#141414] border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col group shadow-xl"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                <img
                  src={vehicle.images[0] || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-black/80 backdrop-blur text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-white/10">
                    {vehicle.year}
                  </span>
                  <span className="bg-emerald-950/80 backdrop-blur text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-800/40">
                    Certified
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-zinc-950/90 text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800">
                    {vehicle.stock_code}
                  </span>
                </div>
              </div>

              {/* Vehicle Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xl font-black text-white group-hover:text-zinc-200 tracking-tight">
                      {vehicle.make} {vehicle.model}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-1">
                    {vehicle.derivative || 'Special Edition DSG'}
                  </p>

                  {/* Quick Specs Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/60">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-bold">Mileage</span>
                      <span className="text-zinc-200 font-semibold">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-bold">Gearbox</span>
                      <span className="text-zinc-200 font-semibold">{vehicle.transmission}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-bold">Fuel</span>
                      <span className="text-zinc-200 font-semibold">{vehicle.fuel_type}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Installment Row */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                        Retail Cash Price
                      </span>
                      <span className="text-xl font-black text-white">{formatZAR(vehicle.price)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                        Est. Installment
                      </span>
                      <span className="text-lg font-black text-emerald-400">
                        {formatZAR(vehicle.estimated_installment || 0)} <span className="text-xs font-normal text-zinc-400">/pm*</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCalculatorVehicle(vehicle)}
                      className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold py-2.5 rounded-xl border border-zinc-700 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Finance Tool
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectVehicleForFinance ? onSelectVehicleForFinance(vehicle) : window.location.assign('#finance')}
                      className="flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-extrabold py-2.5 rounded-xl transition-colors shadow"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal / Slide-out Interactive Finance Calculator */}
      {activeCalculatorVehicle && activeCalcResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveCalculatorVehicle(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-400 text-sm">🧮</span>
              <h3 className="text-lg font-black">Digital Finance Calculator</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              {activeCalculatorVehicle.year} {activeCalculatorVehicle.make} {activeCalculatorVehicle.model} ({formatZAR(activeCalculatorVehicle.price)})
            </p>

            {/* Calculated Big Banner */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center mb-5">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                Estimated Monthly Repayment
              </span>
              <div className="text-3xl font-black text-emerald-400">
                {formatZAR(activeCalcResult.monthlyInstallment)}
                <span className="text-sm font-normal text-zinc-400"> / month</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Principal: {formatZAR(activeCalcResult.principalFinanced)} • Term: {termMonths} Months @ {activeCalcResult.interestRateAnnual}%
              </p>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 text-xs mb-5">
              {/* Deposit */}
              <div>
                <div className="flex justify-between font-semibold text-zinc-300 mb-1">
                  <span>Deposit ({depositPct}%)</span>
                  <span>{formatZAR(activeCalcResult.deposit)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={depositPct}
                  onChange={(e) => setDepositPct(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              {/* Loan Term */}
              <div>
                <div className="flex justify-between font-semibold text-zinc-300 mb-1">
                  <span>Loan Period</span>
                  <span>{termMonths} Months ({termMonths / 12} Years)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[36, 48, 60, 72].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTermMonths(m)}
                      className={`py-1.5 rounded-lg font-bold border transition-colors ${
                        termMonths === m
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Balloon */}
              <div>
                <div className="flex justify-between font-semibold text-zinc-300 mb-1">
                  <span>Balloon / Residual ({balloonPct}%)</span>
                  <span>{formatZAR(activeCalcResult.balloonAmount)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="5"
                  value={balloonPct}
                  onChange={(e) => setBalloonPct(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>

            {/* NCA Legal Disclaimer */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5 text-[10px] text-zinc-400 leading-relaxed mb-5">
              <strong className="text-zinc-300">NCA Disclosure:</strong> {activeCalcResult.disclaimer}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  const url = `https://wa.me/27821234567?text=${encodeURIComponent(
                    `Hi Prime Lane Motors! I would like to enquire about financing the ${activeCalculatorVehicle.year} ${activeCalculatorVehicle.make} ${activeCalculatorVehicle.model} (${activeCalculatorVehicle.stock_code}) at ~${formatZAR(activeCalcResult.monthlyInstallment)}/pm.`
                  )}`;
                  window.open(url, '_blank');
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl border border-zinc-700 text-xs transition-colors"
              >
                WhatsApp Dealer
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSelectVehicleForFinance) {
                    onSelectVehicleForFinance(activeCalculatorVehicle);
                  }
                  setActiveCalculatorVehicle(null);
                }}
                className="bg-white hover:bg-zinc-200 text-black font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Proceed to Application
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VwCatalogue;
