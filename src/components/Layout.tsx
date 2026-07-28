import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Landmark,
  User as UserIcon,
  Bell,
  LogOut,
  Sun,
  Moon,
  Download
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { AppLogo } from "./AppLogo";
import { useState } from "react";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [showFabMenu, setShowFabMenu] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/loans", label: "My Loans", icon: Landmark },
    { to: "/notifications", label: "Reminders", icon: Bell, badge: unreadCount },
    { to: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 flex flex-col font-sans pb-20 lg:pb-0">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <AppLogo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0" />
            <div className="min-w-0">
              <h1 className="font-semibold text-lg leading-tight truncate bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Loan Tracker
              </h1>
              <p className="text-slate-400 text-xs truncate flex items-center gap-1">
                Hi, {user?.name ?? "User"} <span className="text-yellow-400">👋</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors">
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-6 w-full relative">
        <Outlet />
      </main>

      {/* Floating Action Button & Menu */}
      <div className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 flex flex-col items-end gap-3">
        {showFabMenu && (
          <div className="flex flex-col gap-3 items-end mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <button onClick={() => { setShowFabMenu(false); navigate("/loans/new"); }} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              <span>Add New Loan</span>
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400"><Plus className="w-4 h-4" /></div>
            </button>
            <button onClick={() => setShowFabMenu(false)} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              <span>Export PDF Report</span>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><LayoutDashboard className="w-4 h-4" /></div>
            </button>
            {isInstallable && (
              <button onClick={() => { setShowFabMenu(false); install(); }} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors text-brand-300">
                <span>Install App</span>
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400"><Download className="w-4 h-4" /></div>
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-transform duration-300 ${showFabMenu ? 'rotate-45 scale-110' : 'hover:scale-105'} active:scale-95`}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Bottom Navigation (Mobile mostly, but acting as main nav) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1c]/90 backdrop-blur-xl border-t border-white/10 lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b lg:bg-transparent lg:backdrop-blur-none lg:static">
        <div className="max-w-6xl mx-auto px-6 h-20 lg:h-14 flex items-center justify-between lg:justify-start lg:gap-8">
          {nav.map(({ to, label, icon: Icon, badge }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex flex-col lg:flex-row items-center gap-1.5 lg:gap-2 p-2 group"
              >
                <div className={`relative flex items-center justify-center transition-colors ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
                  {!!badge && badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] lg:text-sm font-medium transition-colors ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 lg:-bottom-[18px] left-1/2 -translate-x-1/2 w-8 lg:w-full h-1 bg-brand-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
