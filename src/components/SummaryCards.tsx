import { Landmark, TrendingDown, CalendarClock, AlertCircle } from "lucide-react";
import { formatCurrency } from "../utils/format";

interface Props {
  activeLoans: number;
  totalDebt: number;
  thisMonthEmi: number;
  overdueCount: number;
}

export function SummaryCards({
  activeLoans,
  totalDebt,
  thisMonthEmi,
  overdueCount,
}: Props) {
  const cards = [
    {
      label: "Active Loans",
      value: String(activeLoans),
      icon: Landmark,
      color: "bg-blue-500",
    },
    {
      label: "Total Outstanding",
      value: formatCurrency(totalDebt),
      icon: TrendingDown,
      color: "bg-violet-500",
    },
    {
      label: "This Month's EMI Due",
      value: formatCurrency(thisMonthEmi),
      icon: CalendarClock,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="space-y-4">
      {overdueCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            You have <strong>{overdueCount}</strong> overdue EMI
            {overdueCount > 1 ? "s" : ""}. Please pay soon.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold tabular-nums mt-1">{card.value}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-white`}
              >
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
