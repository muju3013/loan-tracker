import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Landmark,
  CalendarDays,
  Wallet,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { InstallPwaButton } from "./InstallPwaButton";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/loans", label: "My Loans", icon: Landmark },
  { to: "/loans/new", label: "Add Loan", icon: PlusCircle },
  { to: "/holidays", label: "Holidays", icon: CalendarDays },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-lg leading-tight truncate">
                Loan & EMI Tracker
              </h1>
              <p className="text-brand-100 text-xs truncate">
                Hi, {user?.name ?? "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <InstallPwaButton className="px-3 py-2 rounded-lg text-sm text-brand-100 hover:bg-brand-800 hover:text-white transition-colors" />
            <ThemeToggle className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-100 hover:bg-brand-800 hover:text-white transition-colors" />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-100 hover:bg-brand-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-brand-600 text-brand-700 dark:text-brand-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        Personal Loan & EMI Tracker
      </footer>
    </div>
  );
}
