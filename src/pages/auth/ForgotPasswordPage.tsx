import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/app/AuthContext";

export function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch {
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white font-body selection:bg-[#177A5C] selection:text-white">
      {/* LEFT PANEL: Form Section */}
      <div className="flex w-full flex-col justify-between p-5 sm:p-10 md:w-1/2 lg:p-16 xl:p-20">
        {/* Main Content Area */}
        <div className="my-auto py-10 max-w-md w-full mx-auto">
          {/* Top Header Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#177A5C] text-white shadow-sm">
              <Star className="h-5 w-5 fill-none stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold tracking-tight text-[#1C1C1A] leading-none">
                Lumière MedSpa
              </h2>
              <span className="mt-1 block font-body text-[11px] font-medium tracking-widest text-[#9CA3AF] uppercase">
                OPERATIONS
              </span>
            </div>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1C1A]">
            Reset Password
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B7280]">
            {isSubmitted
              ? "We've sent a recovery link to your inbox."
              : "Enter your registered work email to receive password reset instructions."}
          </p>

          {isSubmitted ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-emerald-200 bg-[#F5F9F7] p-5 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-[#177A5C]" />
                <p className="font-heading text-base font-semibold text-[#1C1C1A]">Check your email</p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Instructions have been sent to <span className="font-medium text-[#1C1C1A]">{email}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/reset-password"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#177A5C] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#13634A]"
                >
                  Set New Password Demo →
                </Link>
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E5E0D8] bg-[#F5F2EC] py-3 text-sm font-medium text-[#4B5563] hover:bg-[#EFEBE4]"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@lumiere.com"
                      required
                      className="w-full rounded-[14px] bg-[#F5F2EC] px-4 py-3.5 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-[#177A5C] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#177A5C]/25 transition-all hover:bg-[#13634A] hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending link...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#177A5C] hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-6 text-xs text-[#9CA3AF] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Lumière MedSpa</span>
          <Link to="/login" className="text-[#177A5C] font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL: Luxury MedSpa Treatment Room Photo */}
      <div className="hidden md:block w-1/2 relative bg-[#F5F2EC] overflow-hidden">
        <img
          src="/medspa_login_bg.png"
          alt="Lumière MedSpa Suite"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
