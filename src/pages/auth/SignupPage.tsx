import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import type { UserRole } from "@/components/shared/Sidebar";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("front_desk");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      await signup(name, email, role, password);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white font-body selection:bg-[#177A5C] selection:text-white">
      {/* LEFT PANEL: Form Section */}
      <div className="flex w-full flex-col justify-between p-5 sm:p-10 md:w-1/2 lg:p-16 xl:p-20 overflow-y-auto">
        {/* Main Content Form Area */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
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
            Create an account
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B7280]">
            Sign up to access practice operations and manage your clinic schedule.
          </p>

          {/* Form Error Message */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                required
                className="w-full rounded-[14px] bg-[#F5F2EC] px-4 py-3 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@lumieremedspa.com"
                required
                className="w-full rounded-[14px] bg-[#F5F2EC] px-4 py-3 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Select Practice Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "front_desk", title: "Front Desk" },
                  { id: "manager", title: "Manager" },
                ].map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-[#177A5C] bg-[#177A5C] text-white shadow-sm"
                          : "border-[#E5E0D8] bg-[#F5F2EC] text-[#4B5563] hover:border-[#177A5C]/40"
                      }`}
                    >
                      <span>{r.title}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-[14px] bg-[#F5F2EC] pl-4 pr-10 py-3 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8A80] hover:text-[#1C1C1A]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="h-4 w-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-[14px] bg-[#F5F2EC] px-4 py-3 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-[#E8E4DF] text-[#177A5C] focus:ring-[#177A5C]"
              />
              <label htmlFor="terms" className="text-xs text-[#4B5563]">
                I agree to the{" "}
                <a href="#" className="text-[#177A5C] underline hover:text-[#13634A]">
                  Terms & HIPAA Policies
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#177A5C] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#177A5C]/25 transition-all hover:bg-[#13634A] hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6B7280]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#177A5C] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 text-xs text-[#9CA3AF] text-center sm:text-left">
          <span>© {new Date().getFullYear()} Lumière MedSpa. All rights reserved.</span>
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
