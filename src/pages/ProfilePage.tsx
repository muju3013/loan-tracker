import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppStore } from "../hooks/useAppStore";
import { AIAdvisorService } from "../services/aiAdvisorService";
import { ExportService } from "../services/exportService";
import {
  User as UserIcon,
  Settings,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Bell,
  Globe,
  Key,
  AlertTriangle,
  Mail,
  Smartphone,
  Info,
  CheckCircle2,
  CreditCard,
  PieChart,
  Landmark,
  TrendingDown
} from "lucide-react";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { loans, data, dashboard } = useAppStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const aiAnalysis = useMemo(() => {
    return AIAdvisorService.analyze(loans, data.emiSchedule, 50000);
  }, [loans, data.emiSchedule]);

  const monthlyEmiBurden = useMemo(() => {
    return loans.reduce((sum, l) => sum + l.emiAmount, 0);
  }, [loans]);

  const handleExport = () => {
    ExportService.generateReport(data, user?.name || "User");
  };

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const SectionCard = ({ title, icon: Icon, children }: any) => (
    <div className="glass-card p-5 mb-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
      </div>
      <div className="space-y-1 relative z-10">{children}</div>
    </div>
  );

  const ActionRow = ({ icon: Icon, label, value, onClick, textColor = "text-slate-300", hasChevron = true }: any) => (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${textColor}`} />
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-slate-400">{value}</span>}
        {hasChevron && onClick && <ChevronRight className="w-4 h-4 text-slate-500" />}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* User Profile Card */}
      <div className="glass-card glow-border p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 p-1 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full bg-[#0a0f1c] rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-[#0a0f1c]">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0a0f1c] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name || "User Name"}</h2>
            <p className="text-slate-400 text-sm mb-1">{user?.email || "user@example.com"}</p>
            <p className="text-brand-400 text-xs font-medium mb-4">Member since 2026</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Landmark className="w-5 h-5 text-brand-400" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Loans</p>
                  <p className="text-sm font-bold text-white">{dashboard.activeLoansCount}</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Health Score</p>
                  <p className="text-sm font-bold text-white">{aiAnalysis.score}/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          {/* Financial Summary */}
          <SectionCard title="Financial Summary" icon={PieChart}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Outstanding</p>
                <p className="text-lg font-bold text-white">₹{dashboard.totalOutstanding.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Paid</p>
                <p className="text-lg font-bold text-green-400">₹{dashboard.totalPaidAllLoans.toLocaleString()}</p>
              </div>
            </div>
            <ActionRow icon={CreditCard} label="Monthly EMI Burden" value={`₹${monthlyEmiBurden.toLocaleString()}`} hasChevron={false} />
            <ActionRow icon={FileText} label="Total Loans Created" value={data.loans.length} hasChevron={false} />
          </SectionCard>

          {/* Account Settings */}
          <SectionCard title="Account Settings" icon={Settings}>
            <ActionRow icon={UserIcon} label="Edit Profile" onClick={() => {}} />
            <ActionRow icon={Key} label="Change Password" onClick={() => {}} />
            <ActionRow icon={Bell} label="Notification Settings" onClick={() => {}} />
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={handleToggleTheme}>
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-slate-300" />}
                <span className="text-sm font-medium text-slate-300">Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{isDark ? "Dark" : "Light"}</span>
              </div>
            </div>
            <ActionRow icon={Globe} label="Language" value="English" onClick={() => {}} />
          </SectionCard>

          {/* Security */}
          <SectionCard title="Security" icon={Shield}>
            <ActionRow icon={CheckCircle2} label="Authentication Status" value="Verified" textColor="text-green-400" hasChevron={false} />
            <ActionRow icon={Smartphone} label="Last Login" value="Just now" hasChevron={false} />
            <ActionRow icon={Mail} label="Connected Email" value={user?.email || "Linked"} hasChevron={false} />
          </SectionCard>
        </div>

        {/* Right Column */}
        <div>
          {/* Reports & Data */}
          <SectionCard title="Reports & Data" icon={FileText}>
            <ActionRow icon={TrendingDown} label="Export EMI Schedule PDF" onClick={handleExport} />
            <ActionRow icon={PieChart} label="Export Payment History" onClick={handleExport} />
            <ActionRow icon={Landmark} label="Export Loan Summary" onClick={handleExport} />
          </SectionCard>

          {/* About */}
          <SectionCard title="About" icon={Info}>
            <ActionRow icon={AlertTriangle} label="App Version" value="v2.1.0" hasChevron={false} />
            <ActionRow icon={FileText} label="Privacy Policy" onClick={() => {}} />
            <ActionRow icon={FileText} label="Terms & Conditions" onClick={() => {}} />
          </SectionCard>

          {/* Support */}
          <SectionCard title="Support" icon={HelpCircle}>
            <ActionRow icon={Mail} label="Contact Support" onClick={() => {}} />
            <ActionRow icon={Info} label="Send Feedback" onClick={() => {}} />
            <ActionRow icon={AlertTriangle} label="Report Bug" onClick={() => {}} textColor="text-orange-400" />
          </SectionCard>

          {/* Logout Section */}
          <div className="glass-card p-5 border-red-500/20">
            {showLogoutConfirm ? (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm text-slate-300 mb-4 text-center">Are you sure you want to log out?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-colors"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 hover:border-red-500/30 transition-colors group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
