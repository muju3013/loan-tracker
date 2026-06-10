import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";
import { AppLogo } from "../components/AppLogo";
import { ForgotPasswordFlow } from "../components/ForgotPasswordFlow";

type Mode = "login" | "signup" | "forgot";

export function AuthPage() {
  const { user, isLoading, login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const err = await register(name, email, password);
        if (err) setError(err);
      } else if (mode === "login") {
        const err = await login(email, password);
        if (err) setError(err);
      } else if (mode === "forgot") {
        const err = await resetPassword(email);
        if (err) {
          setError(err);
        } else {
          setSuccess("Password reset email sent! Check your inbox.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setSuccess("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen flex relative bg-[#0a0f1c] text-slate-200">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-colors" />
      </div>
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0f1c] to-[#111827] flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        
        <div className="flex items-center gap-3 relative z-10">
          <AppLogo className="w-12 h-12 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <span className="font-bold text-2xl tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Loan Tracker</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Manage your loans
            <br />
            in one place
          </h1>
          <p className="mt-6 text-slate-400 text-lg max-w-md leading-relaxed">
            Track EMIs, due dates, and payments. Your data stays private in this browser.
          </p>
        </div>
        <p className="text-slate-500 text-sm relative z-10">Personal finance demo · Secure accounts</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0f1c] relative overflow-hidden">
        {/* Mobile background glows */}
        <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <AppLogo className="w-12 h-12 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            <span className="font-bold text-2xl tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Loan Tracker</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[24px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden relative">
            {/* Inner glow line at top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
            
            {mode !== "forgot" && (
              <div className="flex border-b border-white/5">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`flex-1 py-4 text-sm font-medium transition-all duration-300 ${
                    mode === "login"
                      ? "text-brand-400 border-b-2 border-brand-500 bg-brand-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`flex-1 py-4 text-sm font-medium transition-all duration-300 ${
                    mode === "signup"
                      ? "text-brand-400 border-b-2 border-brand-500 bg-brand-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Sign up
                </button>
              </div>
            )}

            {mode === "forgot" ? (
              <div className="p-8">
                <ForgotPasswordFlow onBackToLogin={() => switchMode("login")} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {mode === "login" ? "Welcome back" : "Create account"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1.5">
                    {mode === "login"
                      ? "Enter your email and password"
                      : "Sign up to start tracking your loans"}
                  </p>
                </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-xl px-4 py-3 backdrop-blur-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-400 bg-green-950/50 border border-green-900/50 rounded-xl px-4 py-3 backdrop-blur-md">
                  {success}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Full name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-600"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    {mode === "login" && (
                      <button
                         type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 scale-100 active:scale-[0.98]"
              >
                {submitting
                  ? "Please wait…"
                  : mode === "login"
                    ? "Log in"
                    : "Create account"}
              </button>
            </form>
            )}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Made with <span className="text-red-500">❤️</span> 1330
          </p>
        </div>
      </div>
    </div>
  );
}

