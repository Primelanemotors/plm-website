import React, { useState } from 'react';
import { submitPublicEnquiry } from '../services/leadService';

interface FinanceEnquiryFormProps {
  vehicleInterestDefault?: string;
  onSuccess?: (leadCode: string) => void;
}

export const FinanceEnquiryForm: React.FC<FinanceEnquiryFormProps> = ({
  vehicleInterestDefault = '2024 VW Polo TSI',
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState(vehicleInterestDefault);
  const [employmentType, setEmploymentType] = useState('Permanently Employed');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [hasValidLicense, setHasValidLicense] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const comments = `Employment: ${employmentType} | Monthly Income: R${monthlyIncome} | Valid License: ${hasValidLicense ? 'Yes' : 'No'}`;

    const res = await submitPublicEnquiry({
      customer_name: fullName,
      phone,
      email,
      vehicle_interest: vehicle,
      vehicle_year: 2024,
      lead_source: 'Website Enquiry',
      comments,
    });

    setLoading(false);

    if (res.success && res.leadCode) {
      setSubmittedCode(res.leadCode);
      if (onSuccess) onSuccess(res.leadCode);
    } else {
      setErrorMessage(res.error || 'Failed to submit application. Please verify your details and retry.');
    }
  };

  if (submittedCode) {
    return (
      <div className="bg-[#141414] border border-emerald-500/40 rounded-2xl p-6 text-center text-white">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-1">Application Dispatched</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Your enquiry has been securely logged into the PLM Sales Command Centre.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 inline-block mb-4">
          <span className="text-xs text-zinc-500 block uppercase font-bold tracking-wider">Reference Code</span>
          <span className="text-lg font-black text-emerald-400 tracking-wider">{submittedCode}</span>
        </div>
        <p className="text-xs text-zinc-400">
          A designated Prime Lane Motors sales specialist will contact you via phone/WhatsApp within our business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#272727] rounded-2xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Fast-Track Vehicle Finance</h2>
          <p className="text-xs text-zinc-400">WesBank, Absa, Standard Bank & MFC approved dealer</p>
        </div>
        <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Instant Sync
        </span>
      </div>

      {errorMessage && (
        <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-3 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-zinc-400 uppercase tracking-wider font-bold mb-1">Full Legal Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sipho Ndlovu"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 uppercase tracking-wider font-bold mb-1">Mobile Number (WhatsApp) *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="082 123 4567"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-zinc-400 uppercase tracking-wider font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sipho@example.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 uppercase tracking-wider font-bold mb-1">Desired Vehicle *</label>
          <input
            type="text"
            required
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            placeholder="e.g. 2024 VW Polo 1.0 TSI Life"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-400 uppercase tracking-wider font-bold mb-1">Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
            >
              <option>Permanently Employed</option>
              <option>Self-Employed / Business Owner</option>
              <option>Contract Worker</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 uppercase tracking-wider font-bold mb-1">Gross Monthly Income (ZAR)</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 35000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="driverLicense"
            checked={hasValidLicense}
            onChange={(e) => setHasValidLicense(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
          />
          <label htmlFor="driverLicense" className="text-zinc-300 text-xs">
            I hold a valid South African driver's license
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-5 bg-white hover:bg-zinc-200 text-black font-extrabold text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Submitting to PLM Command Centre...
          </>
        ) : (
          'Submit Finance Enquiry'
        )}
      </button>
      <div className="text-center mt-2.5 text-[11px] text-zinc-500">
        Strictly confidential • Regulated under the National Credit Act (NCA)
      </div>
    </form>
  );
};
