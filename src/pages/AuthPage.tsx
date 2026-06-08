import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, Wallet } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";

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
    <div className="min-h-screen flex relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 backdrop-blur-sm transition-colors" />
      </div>
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="font-semibold text-xl">Loan & EMI Tracker</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight">
            Manage your loans
            <br />
            in one place
          </h1>
          <p className="mt-4 text-brand-100 text-lg max-w-md">
            Track EMIs, due dates, and payments. Your data stays private in this browser.
          </p>
        </div>
        <p className="text-brand-200 text-sm">Personal finance demo · Secure accounts</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">Loan & EMI Tracker</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "text-brand-700 dark:text-brand-400 border-b-2 border-brand-600 bg-brand-50/50 dark:bg-brand-900/30"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                  mode === "signup"
                    ? "text-brand-700 dark:text-brand-400 border-b-2 border-brand-600 bg-brand-50/50 dark:bg-brand-900/30"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset Password"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {mode === "login"
                    ? "Enter your email and password"
                    : mode === "signup"
                    ? "Sign up to start tracking your loans"
                    : "Enter your email to receive a password reset link"}
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg px-3 py-2">
                  {success}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 disabled:opacity-60 transition-colors"
              >
                {submitting
                  ? "Please wait…"
                  : mode === "login"
                    ? "Log in"
                    : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
              </button>
              
              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="w-full py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back to login
                </button>
              )}
            </form>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Secured with Firebase Authentication & Firestore.
          </p>
        </div>
      </div>
    </div>
  );
}

