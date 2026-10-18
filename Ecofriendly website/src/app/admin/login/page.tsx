"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Leaf, Eye, EyeOff, AlertCircle } from "lucide-react";
import { login, getMe } from "@/lib/authApi";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  // If already authenticated, redirect to /admin immediately
  useEffect(() => {
    getMe()
      .then((admin) => {
        if (admin) {
          router.replace("/admin");
        }
      })
      .catch(() => {
        // Not authenticated or backend unreachable — stay on login page
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    // Client-side basic validation
    if (!trimmedEmail) {
      setError("Email is required.");
      emailRef.current?.focus();
      return;
    }
    if (!trimmedPassword) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      await login(trimmedEmail, trimmedPassword);
      router.replace("/admin");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while checking existing auth (avoids flash of login form)
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest via-charcoal to-charcoal flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sugarcane animate-spin" aria-label="Checking authentication…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest via-charcoal to-charcoal flex flex-col items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 shadow-xl flex-shrink-0">
            <Image 
              src="/images/logo.png" 
              alt="SUGRAVA Logo" 
              fill 
              className="object-cover" 
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-wider">
            SUGRAVA™
          </h1>
          <p className="text-xs text-gold/90 font-medium tracking-widest uppercase">
            Admin Portal
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg sm:text-xl font-semibold text-ivory mb-1">
            Sign in to continue
          </h2>
          <p className="text-sm text-ivory/50 mb-6">
            Enter your administrator credentials below.
          </p>

          <form
            id="admin-login-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Admin login form"
          >
            {/* Error alert */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="mb-4">
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-ivory/80 mb-1.5"
              >
                Email address
              </label>
              <input
                ref={emailRef}
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="admin@example.com"
                disabled={loading}
                required
                aria-required="true"
                aria-describedby={error ? "login-error" : undefined}
                className="w-full rounded-lg bg-white/8 border border-white/15 text-ivory placeholder-ivory/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sugarcane/60 focus:border-sugarcane/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password field */}
            <div className="mb-6">
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-ivory/80 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                  aria-required="true"
                  className="w-full rounded-lg bg-white/8 border border-white/15 text-ivory placeholder-ivory/30 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sugarcane/60 focus:border-sugarcane/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory/80 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-sugarcane text-white font-semibold py-3 text-sm hover:bg-sugarcane/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sugarcane/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-ivory/30">
          SUGRAVA™ Admin · Restricted access only
        </p>
      </div>
    </div>
  );
}
