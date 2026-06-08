import type { EmiStatus } from "../types";

const styles: Record<EmiStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
  pending: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
  overdue: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
  partial: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
};

const labels: Record<EmiStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  partial: "Partial",
};

export function StatusBadge({ status }: { status: EmiStatus }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
