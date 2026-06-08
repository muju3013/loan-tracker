import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { formatDisplayDate } from "../utils/dueDateEngine";

export function HolidaysPage() {
  const { data, addHoliday, removeHoliday } = useAppStore();
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !name.trim()) {
      setError("Date and name are required");
      return;
    }
    if (data.holidays.some((h) => h.holidayDate === date)) {
      setError("Holiday already exists for this date");
      return;
    }
    addHoliday(date, name);
    setDate("");
    setName("");
    setError("");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Bank Holidays</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Reference list of bank holidays (optional). EMI due dates use your loan start
          date each month and are not adjusted for holidays.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm flex flex-wrap gap-3 items-end"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium mb-1">Holiday Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Republic Day"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          Add Holiday
        </button>
        {error && <p className="text-red-600 text-sm w-full">{error}</p>}
      </form>

      <ul className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
        {data.holidays.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div>
              <p className="font-medium">{h.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{formatDisplayDate(h.holidayDate)}</p>
            </div>
            <button
              type="button"
              onClick={() => removeHoliday(h.id)}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label="Remove holiday"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
