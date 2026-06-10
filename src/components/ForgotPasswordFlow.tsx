import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordFlow({ onBackToLogin }: ForgotPasswordFlowProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");
    
    try {
      const errMessage = await resetPassword(email);
      
      if (errMessage) {
        // Handle specific Firebase errors
        if (errMessage.includes("user-not-found") || errMessage.includes("invalid-credential")) {
          setError("No account found with this email.");
        } else if (errMessage.includes("network-request-failed")) {
          setError("Unable to send reset email. Please try again.");
        } else {
          setError(errMessage);
        }
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <button onClick={onBackToLogin} className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
        {!success && (
          <>
            <h2 className="text-2xl font-bold text-white mb-1.5">Reset Password</h2>
            <p className="text-sm text-slate-400">Enter your registered email address to receive a password reset link.</p>
          </>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-xl px-4 py-3 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {!success ? (
        <form onSubmit={handleSendResetEmail} className="space-y-5 relative">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:shadow-none transition-all duration-300 flex justify-center items-center gap-2 overflow-hidden relative"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              <>
                Send Reset Link <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-8 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] relative">
            <div className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-20" />
            <CheckCircle2 className="w-10 h-10 animate-in spin-in-180 duration-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Email Sent!</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-sm mx-auto">
            Password reset link has been sent to your email address. Please check your inbox and spam folder.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-300 backdrop-blur-md"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
