import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { EmiScheduleTable } from "../components/EmiScheduleTable";
import { formatCurrency, formatCurrencyExact } from "../utils/format";
import { formatDisplayDate } from "../utils/dueDateEngine";

export function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLoan, getLoanEmis, getLoanStats, payEmi, unpayEmi, removeLoan } =
    useAppStore();

  const loan = id ? getLoan(id) : undefined;
  const emis = id ? getLoanEmis(id) : [];
  const stats = id ? getLoanStats(id) : null;

  if (!loan || !stats) {
    return (
      <div>
        <p className="text-slate-500 dark:text-slate-400">Loan not found.</p>
        <Link to="/loans" className="text-brand-600 text-sm mt-2 inline-block">
          ← Back to loans
        </Link>
      </div>
    );
  }

  function handlePay(emiId: string) {
    const today = new Date().toISOString().slice(0, 10);
    payEmi(emiId, today);
  }

  const loanId = loan.id;
  const loanName = loan.loanName;

  async function handleDelete() {
    if (confirm(`Delete "${loanName}" and all EMI records?`)) {
      await removeLoan(loanId);
      navigate("/loans");
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to="/loans"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to loans
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{loan.loanName}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/loans/${loan.id}/edit`}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Loan Amount", value: formatCurrency(loan.principalAmount) },
          { label: "Interest Rate", value: `${loan.annualInterestRate}% p.a.` },
          { label: "Monthly EMI", value: formatCurrencyExact(loan.emiAmount) },
          { label: "Tenure", value: `${loan.tenureMonths} months` },
          { label: "Start Date", value: formatDisplayDate(loan.loanStartDate) },
          { label: "Total Interest", value: formatCurrencyExact(loan.totalInterest) },
          { label: "Total Payable", value: formatCurrencyExact(loan.totalPayable) },
          { label: "Remaining Principal", value: formatCurrency(stats.remainingPrincipal) },
          { label: "Total Paid", value: formatCurrency(stats.totalPaid) },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-sm"
          >
            <p className="text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="font-semibold mt-1 tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">EMI Schedule</h2>
        <EmiScheduleTable
          emis={emis}
          onMarkPaid={handlePay}
          onMarkPending={unpayEmi}
        />
      </div>
    </div>
  );
}
