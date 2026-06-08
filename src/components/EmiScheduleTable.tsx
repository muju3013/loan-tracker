import { Check, RotateCcw } from "lucide-react";
import type { EmiInstallment } from "../types";
import { formatDisplayDate } from "../utils/dueDateEngine";
import { formatCurrencyExact } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

interface Props {
  emis: EmiInstallment[];
  onMarkPaid: (emiId: string) => void;
  onMarkPending: (emiId: string) => void;
}

export function EmiScheduleTable({ emis, onMarkPaid, onMarkPending }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-700/50 text-left text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Due Date</th>
            <th className="px-4 py-3 font-medium text-right">EMI</th>
            <th className="px-4 py-3 font-medium text-right">Principal</th>
            <th className="px-4 py-3 font-medium text-right">Interest</th>
            <th className="px-4 py-3 font-medium text-right">Balance</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {emis.map((emi) => {
            const rowClass =
              emi.status === "overdue"
                ? "border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-900/20"
                : emi.status === "paid"
                  ? "opacity-75"
                  : "";

            return (
              <tr
                key={emi.id}
                className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 ${rowClass}`}
              >
                <td className="px-4 py-3 font-medium">{emi.installmentNumber}</td>
                <td className="px-4 py-3 font-medium">
                  {formatDisplayDate(emi.scheduledDueDate)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">
                  {formatCurrencyExact(emi.emiAmount)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {formatCurrencyExact(emi.principalComponent)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {formatCurrencyExact(emi.interestComponent)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrencyExact(emi.closingBalance)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={emi.status} />
                  {emi.paymentDate && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Paid {formatDisplayDate(emi.paymentDate)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {emi.status !== "paid" ? (
                    <button
                      type="button"
                      onClick={() => onMarkPaid(emi.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                    >
                      <Check className="w-3 h-3" />
                      Mark Paid
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onMarkPending(emi.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
