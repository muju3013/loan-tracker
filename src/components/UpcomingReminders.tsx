import { Link } from "react-router-dom";
import { Calendar, Check } from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "../hooks/useAppStore";
import { formatDisplayDate } from "../utils/dueDateEngine";
import { formatCurrencyExact } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

export function UpcomingReminders() {
  const { upcomingEmis, getLoan, payEmi } = useAppStore();
  const monthLabel = format(new Date(), "MMMM yyyy");

  if (upcomingEmis.length === 0) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">Upcoming EMIs</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">No upcoming payments. Add a loan to get started.</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-lg">Upcoming EMIs</h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">{monthLabel}</span>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700">
        {upcomingEmis.map((emi) => {
          const loan = getLoan(emi.loanId);

          return (
            <li key={emi.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/loans/${emi.loanId}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {loan?.loanName ?? "Loan"}
                  </Link>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Installment #{emi.installmentNumber}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={emi.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrencyExact(emi.emiAmount)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Due{" "}
                    <span className="font-medium">
                      {formatDisplayDate(emi.scheduledDueDate)}
                    </span>
                  </p>
                </div>
              </div>
              {emi.status !== "paid" && (
                <button
                  type="button"
                  onClick={() => payEmi(emi.id, new Date().toISOString().slice(0, 10))}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4" />
                  Mark as Paid
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
