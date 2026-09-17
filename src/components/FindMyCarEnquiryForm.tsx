import React, { useState } from 'react';
import { submitPublicEnquiry } from '../services/leadService';

export const FindMyCarEnquiryForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetMakeModel, setTargetMakeModel] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [transmission, setTransmission] = useState('Automatic');
  const [loading, setLoading] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const comments = `Sourcing Request: ${targetMakeModel} | Max Budget: R${maxBudget} | Gearbox: ${transmission}`;

    const res = await submitPublicEnquiry({
      customer_name: fullName,
      phone,
      vehicle_interest: targetMakeModel,
      lead_source: 'Website Enquiry',
      comments,
    });

    setLoading(false);
    if (res.success && res.leadCode) {
      setReferenceCode(res.leadCode);
    }
  };

  if (referenceCode) {
    return (
      <div className="bg-[#141414] border border-amber-500/40 rounded-2xl p-6 text-center text-white">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
          🚗
        </div>
        <h3 className="text-xl font-bold mb-1">Search Mandate Created</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Our Stock Matching Agent and dealership network will search for your vehicle.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 inline-block mb-3">
          <span className="text-xs text-zinc-500 block uppercase font-bold">Reference</span>
          <span className="text-lg font-black text-amber-400">{referenceCode}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#272727] rounded-2xl p-6 text-white">
      <h3 className="text-base font-bold mb-1">Can't Find Your Ideal Vehicle?</h3>
      <p className="text-xs text-zinc-400 mb-4">We source directly from accredited dealership groups across Gauteng & SA.</p>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-zinc-400 uppercase font-bold mb-1">Your Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
          />
        </div>
        <div>
          <label className="block text-zinc-400 uppercase font-bold mb-1">Phone Number (WhatsApp) *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="082 000 0000"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
          />
        </div>
        <div>
          <label className="block text-zinc-400 uppercase font-bold mb-1">Vehicle Make & Model Desired *</label>
          <input
            type="text"
            required
            value={targetMakeModel}
            onChange={(e) => setTargetMakeModel(e.target.value)}
            placeholder="e.g. 2023 VW Golf 8 GTI or Audi A3"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-zinc-400 uppercase font-bold mb-1">Max Budget (ZAR)</label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="e.g. 450000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-400 uppercase font-bold mb-1">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
            >
              <option>Automatic / DSG</option>
              <option>Manual</option>
              <option>Any</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? 'Searching Network...' : 'Request Vehicle Search'}
      </button>
    </form>
  );
};
