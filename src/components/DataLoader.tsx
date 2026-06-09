import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "../hooks/useAppStore";
import { useAuth } from "../hooks/useAuth";
import { NotificationService } from "../services/notificationService";

export function DataLoader() {
  const { dataLoading, syncError, loans, data } = useAppStore();
  const { user } = useAuth();

  useEffect(() => {
    if (!dataLoading && user && loans.length > 0) {
      NotificationService.generateReminders(user.id, loans, data.emiSchedule);
    }
  }, [dataLoading, user, loans, data.emiSchedule]);

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading your data from Firebase…</p>
      </div>
    );
  }

  return (
    <>
      {syncError && (
        <div className="mb-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          Sync error: {syncError}
        </div>
      )}
      <Outlet />
    </>
  );
}
