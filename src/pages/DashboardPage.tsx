import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText, CalendarDays, BarChart2, TrendingDown, Info, ArrowRight, HeartPulse, BrainCircuit, Landmark } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { useAuth } from "../hooks/useAuth";
import { CountUpNumber } from "../components/CountUpNumber";
import { AIAdvisorService } from "../services/aiAdvisorService";
import { ExportService } from "../services/exportService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { format, parseISO, isSameYear, getMonth } from "date-fns";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function DashboardPage() {
  const { dashboard, loans, data, upcomingEmis } = useAppStore();
  const { user } = useAuth();
  const [showAIInsights, setShowAIInsights] = useState(false);

  const aiAnalysis = useMemo(() => {
    // We pass a dummy income of 50000 for demo, ideally this would come from user profile
    return AIAdvisorService.analyze(loans, data.emiSchedule, 50000);
  }, [loans, data.emiSchedule]);

  const handleExport = () => {
    ExportService.generateReport(data, user?.name || "User");
  };

  const doughnutData = useMemo(() => {
    let principal = 0;
    let interest = 0;
    loans.forEach(l => {
      principal += l.principalAmount;
      interest += l.totalInterest;
    });
    
    return {
      labels: ['Principal', 'Interest'],
      datasets: [{
        data: [principal, interest],
        backgroundColor: ['#3b82f6', '#a855f7'],
        borderColor: ['rgba(59, 130, 246, 0.2)', 'rgba(168, 85, 247, 0.2)'],
        borderWidth: 1,
        cutout: '75%',
      }],
      total: principal + interest,
      principal,
      interest
    };
  }, [loans]);

  const barData = useMemo(() => {
    const monthlyData = new Array(12).fill(0);
    
    data.emiSchedule.forEach(emi => {
      const date = parseISO(emi.scheduledDueDate);
      if (isSameYear(date, new Date())) {
        const month = getMonth(date);
        monthlyData[month] += emi.emiAmount;
      }
    });

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'EMI Due',
        data: monthlyData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      }]
    };
  }, [data.emiSchedule]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false, drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 }, callback: (value: any) => value >= 1000 ? `${value/1000}k` : value } }
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Track loans and monthly EMIs</p>
        </div>

        {/* Loan Health Card */}
        <div className="glass-card glow-border p-4 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowAIInsights(!showAIInsights)}>
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${aiAnalysis.score}, 100`} className="drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" />
            </svg>
            <HeartPulse className="absolute w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Loan Health</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white"><CountUpNumber value={aiAnalysis.score} /></span>
              <span className="text-sm text-slate-500">/100</span>
            </div>
            <p className="text-xs text-green-400 font-medium">{aiAnalysis.text}</p>
          </div>
        </div>
      </div>

      {/* AI Advisor Insights (Collapsible) */}
      {showAIInsights && (
        <div className="glass-card p-5 animate-in fade-in slide-in-from-top-4 border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">AI Financial Advisor</h3>
          </div>
          <div className="space-y-3">
            {aiAnalysis.recommendations.map(rec => (
              <div key={rec.id} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${rec.type === 'warning' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : rec.type === 'positive' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : rec.type === 'action' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-brand-500 shadow-[0_0_8px_#3b82f6]'}`} />
                <p className="text-sm text-slate-300 leading-relaxed">{rec.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/loans/new" className="glass-card px-4 py-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors border-brand-500/30">
          <PlusCircle className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium">Add Loan</span>
        </Link>
        <button onClick={handleExport} className="glass-card px-4 py-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors">
          <FileText className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium">Export PDF</span>
        </button>
        <Link to="/notifications" className="glass-card px-4 py-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors">
          <CalendarDays className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Reminders</span>
        </Link>
        <div className="glass-card px-4 py-2.5 flex items-center gap-2 opacity-50 cursor-not-allowed">
          <BarChart2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">Analytics</span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card glow-border p-5 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4 text-brand-400">
            <Landmark className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Active Loans</p>
          <p className="text-3xl font-bold text-white mb-2"><CountUpNumber value={dashboard.activeLoansCount} /></p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>0 → {dashboard.activeLoansCount}</span>
            <div className="flex-1 h-6 ml-2 relative">
               <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                 <path d="M0,20 Q20,15 40,18 T80,10 T100,5" fill="none" stroke="#3b82f6" strokeWidth="2" className="drop-shadow-[0_0_3px_#3b82f6]" />
               </svg>
            </div>
          </div>
        </div>

        <div className="glass-card glow-border p-5 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold text-white mb-2"><CountUpNumber value={dashboard.totalOutstanding} prefix="₹" /></p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>0 → {dashboard.totalOutstanding > 1000 ? `${(dashboard.totalOutstanding/1000).toFixed(0)}k` : dashboard.totalOutstanding}</span>
            <div className="flex-1 h-6 ml-2 relative">
               <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                 <path d="M0,20 Q30,18 50,15 T80,12 T100,2" fill="none" stroke="#a855f7" strokeWidth="2" className="drop-shadow-[0_0_3px_#a855f7]" />
               </svg>
            </div>
          </div>
        </div>

        <div className="glass-card glow-border p-5 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-400 mb-1">This Month's EMI Due</p>
          <p className="text-3xl font-bold text-white mb-2"><CountUpNumber value={dashboard.thisMonthEmiDue} prefix="₹" /></p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>0 → {dashboard.thisMonthEmiDue > 1000 ? `${(dashboard.thisMonthEmiDue/1000).toFixed(0)}k` : dashboard.thisMonthEmiDue}</span>
            <div className="flex-1 h-6 ml-2 relative">
               <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                 <path d="M0,20 Q20,18 40,10 T70,15 T100,5" fill="none" stroke="#10b981" strokeWidth="2" className="drop-shadow-[0_0_3px_#10b981]" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Principal vs Interest */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">Principal vs Interest <Info className="w-4 h-4 text-slate-500" /></h3>
          </div>
          <div className="flex items-center justify-center gap-8 relative h-48">
            {doughnutData.total > 0 ? (
              <>
                <div className="w-40 h-40 relative">
                  <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { tooltip: { enabled: true }, legend: { display: false } } }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-slate-400">Total</span>
                    <span className="text-sm font-bold text-white">₹{doughnutData.total >= 1000 ? `${(doughnutData.total/1000).toFixed(0)}k` : doughnutData.total}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-brand-500 shadow-[0_0_8px_#3b82f6]" />
                      <span className="text-sm text-slate-300">Principal</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-0.5">₹{doughnutData.principal.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{((doughnutData.principal / doughnutData.total) * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                      <span className="text-sm text-slate-300">Interest</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-0.5">₹{doughnutData.interest.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{((doughnutData.interest / doughnutData.total) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-sm flex items-center h-full">No active loans data.</div>
            )}
          </div>
        </div>

        {/* EMI Overview (Bar Chart) */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">EMI Overview <span className="text-slate-500 text-sm font-normal">(This Year)</span> <Info className="w-4 h-4 text-slate-500" /></h3>
          </div>
          <div className="h-48 w-full">
             <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Upcoming EMIs */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-400" /> Upcoming EMIs
          </h3>
          <span className="text-sm text-slate-400">{format(new Date(), 'MMMM yyyy')} <ArrowRight className="w-4 h-4 inline" /></span>
        </div>
        
        <div className="space-y-3">
          {upcomingEmis.length > 0 ? upcomingEmis.slice(0, 3).map(emi => {
            const loan = loans.find(l => l.id === emi.loanId);
            return (
              <div key={emi.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-900 to-brand-800 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    {loan?.loanName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{loan?.loanName}</h4>
                    <p className="text-xs text-slate-400">Installment #{emi.installmentNumber}</p>
                    <span className={`inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${emi.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : emi.status === 'overdue' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                      {emi.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Due Date</p>
                    <p className="font-medium text-white text-sm">{format(new Date(emi.effectiveDueDate), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-white">₹{emi.emiAmount.toLocaleString()}</p>
                    <Link to={`/loans/${loan?.id}`} className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-block mt-1 border border-brand-500/50 rounded-full px-3 py-1 hover:bg-brand-500/20 transition-colors">Pay Now</Link>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No upcoming EMIs.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer for bottom nav */}
      <div className="h-6"></div>
    </div>
  );
}
