import { useMemo, useState } from "react";
import { calculateEmi } from "../utils/emiCalculator";
import { formatCurrencyExact } from "../utils/format";
import type { Loan } from "../types";
import type { LoanInput } from "../services/loanService";

interface Props {
  initial?: Loan;
  onSubmit: (input: LoanInput) => void | Promise<void>;
  onCancel: () => void;
}

export function LoanForm({ initial, onSubmit, onCancel }: Props) {
  const [loanName, setLoanName] = useState(initial?.loanName ?? "");
  const [principalAmount, setPrincipalAmount] = useState(
    initial?.principalAmount?.toString() ?? ""
  );
  const [annualInterestRate, setAnnualInterestRate] = useState(
    initial?.annualInterestRate?.toString() ?? ""
  );
  const [loanStartDate, setLoanStartDate] = useState(
    initial?.loanStartDate ?? new Date().toISOString().slice(0, 10)
  );
  const [tenureMonths, setTenureMonths] = useState(
    initial?.tenureMonths?.toString() ?? "12"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const preview = useMemo(() => {
    const p = parseFloat(principalAmount);
    const r = parseFloat(annualInterestRate);
    const n = parseInt(tenureMonths, 10);
    if (!p || !n || p <= 0 || n <= 0) return null;
    return calculateEmi(p, r || 0, n);
  }, [principalAmount, annualInterestRate, tenureMonths]);

  function validate(): LoanInput | null {
    const errs: Record<string, string> = {};
    const p = parseFloat(principalAmount);
    const r = parseFloat(annualInterestRate);
    const n = parseInt(tenureMonths, 10);

    if (!loanName.trim()) errs.loanName = "Loan name is required";
    if (!p || p <= 0) errs.principalAmount = "Enter a valid amount";
    if (isNaN(r) || r < 0 || r > 100) errs.annualInterestRate = "Rate must be 0–100%";
    if (!loanStartDate) errs.loanStartDate = "Start date is required";
    if (!n || n < 1 || n > 600) errs.tenureMonths = "Tenure must be 1–600 months";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return null;

    return {
      loanName: loanName.trim(),
      principalAmount: p,
      annualInterestRate: r,
      loanStartDate,
      tenureMonths: n,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = validate();
    if (input) await onSubmit(input);
  }

  const field = (name: string, label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      {children}
      {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field(
          "loanName",
          "Loan Name",
          <input
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            value={loanName}
            onChange={(e) => setLoanName(e.target.value)}
            placeholder="e.g. Home Loan"
          />
        )}
        {field(
          "principalAmount",
          "Total Loan Amount (₹)",
          <input
            type="number"
            min="1"
            step="1"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm tabular-nums focus:ring-2 focus:ring-brand-500 outline-none"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(e.target.value)}
          />
        )}
        {field(
          "annualInterestRate",
          "Interest Rate (% p.a.)",
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm tabular-nums focus:ring-2 focus:ring-brand-500 outline-none"
            value={annualInterestRate}
            onChange={(e) => setAnnualInterestRate(e.target.value)}
          />
        )}
        {field(
          "loanStartDate",
          "Loan Start Date",
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={loanStartDate}
            onChange={(e) => setLoanStartDate(e.target.value)}
          />
        )}
        {field(
          "tenureMonths",
          "Tenure (Months)",
          <input
            type="number"
            min="1"
            max="600"
            step="1"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm tabular-nums focus:ring-2 focus:ring-brand-500 outline-none"
            value={tenureMonths}
            onChange={(e) => setTenureMonths(e.target.value)}
          />
        )}
      </div>

      {preview && (
        <div className="rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-600 dark:text-slate-400">Monthly EMI</p>
            <p className="text-xl font-bold text-brand-900 dark:text-brand-300 tabular-nums">
              {formatCurrencyExact(preview.emiAmount)}
            </p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Total Interest</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrencyExact(preview.totalInterest)}
            </p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Total Payable</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrencyExact(preview.totalPayable)}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
        >
          {initial ? "Save Changes" : "Add Loan & Generate Schedule"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
