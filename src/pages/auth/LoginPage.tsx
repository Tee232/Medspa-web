import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Star, ShieldCheck } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import type { UserRole } from "@/components/shared/Sidebar";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("julia@lumieremedspa.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleQuickRoleSelect = (role: UserRole) => {
    setError(null);
    if (role === "front_desk") {
      setEmail("julia@lumieremedspa.com");
    } else if (role === "manager") {
      setEmail("daniel@lumieremedspa.com");
    }
    setPassword("password123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      let role: UserRole = "front_desk";
      if (email.includes("daniel") || email.includes("manager")) role = "manager";

      await login(email, password, role);
      navigate(from, { replace: true });
    } catch {
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white font-body selection:bg-[#177A5C] selection:text-white">
      {/* LEFT PANEL: Form Section */}
      <div className="flex w-full flex-col justify-between p-8 sm:p-12 md:w-1/2 lg:p-16 xl:p-20">
        {/* Main Content Form Area */}
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B7280]">
            Sign in to manage your clinic operations and stay on top of your day.
          </p>

          {/* Quick Demo Role Selector */}
          <div className="mt-6 mb-2 rounded-2xl bg-[#F8F6F2] p-3 border border-[#EBE7E0]">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#4B5563]">
              <span className="flex items-center gap-1.5 text-[#177A5C]">
                <ShieldCheck className="h-3.5 w-3.5" /> Demo Login Credentials
              </span>
              <span className="text-[10px] text-[#9CA3AF]">Click role to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRoleSelect("front_desk")}
                className={`rounded-xl border py-1.5 text-center text-xs font-medium transition-all ${
                  email.includes("julia")
                    ? "border-[#177A5C] bg-[#177A5C] text-white shadow-sm"
                    : "border-[#E5E0D8] bg-white text-[#4B5563] hover:border-[#177A5C]/40"
                }`}
              >
                Front Desk
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSelect("manager")}
                className={`rounded-xl border py-1.5 text-center text-xs font-medium transition-all ${
                  email.includes("daniel")
                    ? "border-[#177A5C] bg-[#177A5C] text-white shadow-sm"
                    : "border-[#E5E0D8] bg-white text-[#4B5563] hover:border-[#177A5C]/40"
                }`}
              >
                Manager
              </button>
            </div>
          </div>

          {/* Form Error Message */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@lumiere.com"
                required
                className="w-full rounded-[14px] bg-[#F5F2EC] px-4 py-3.5 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-[14px] bg-[#F5F2EC] pl-4 pr-12 py-3.5 text-sm text-[#1C1C1A] placeholder-[#A39E93] outline-none transition-all focus:bg-[#EFEBE4] focus:ring-2 focus:ring-[#177A5C]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8A80] hover:text-[#1C1C1A] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 stroke-[1.8]" />
                  ) : (
                    <Eye className="h-5 w-5 stroke-[1.8]" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#177A5C] hover:underline transition-all"
                >
                  Forgot Password?
                </Link>
              </div>
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
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Centered Create Account Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#6B7280]">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-[#177A5C] hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-xs text-[#9CA3AF] text-center sm:text-left">
          <span>© {new Date().getFullYear()} Lumière MedSpa. All rights reserved.</span>
        </div>
      </div>

      {/* RIGHT PANEL: Luxury MedSpa Treatment Room Photo */}
      <div className="hidden md:block w-1/2 relative bg-[#F5F2EC] overflow-hidden">
        <img
          src="/medspa_login_bg.png"
          alt="Lumière MedSpa Treatment Suite"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0px]" />
      </div>
    </div>
  );
}
