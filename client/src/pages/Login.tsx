/**
 * Outclaw — Login / Register Page
 * Custom email/password auth — no external branding
 */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, ExternalLink, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Mode = "login" | "register";

export default function Login() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed");
    },
  });

  const isPending = loginMutation.isPending || registerMutation.isPending;

  // Check if authenticated user already has a workspace
  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: isAuthenticated === true,
    retry: false,
  });

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (workspacesQuery.data !== undefined) {
        if (workspacesQuery.data.length > 0) {
          setLocation("/cc");
        } else {
          setLocation("/onboarding");
        }
      }
    }
  }, [authLoading, isAuthenticated, workspacesQuery.data, setLocation]);

  // Show spinner while auth is resolving or user is authenticated (about to redirect)
  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D0F]">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#F5C542 transparent #F5C542 #F5C542" }}
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    if (mode === "register") {
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      await registerMutation.mutateAsync({ email, password, name: name.trim() });
    } else {
      await loginMutation.mutateAsync({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D0F] flex flex-col">
      {/* Main content — vertically centered */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#F5C542] flex items-center justify-center rounded-sm">
              <span
                className="text-[#0B0D0F] font-extrabold text-lg"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                O
              </span>
            </div>
            <span
              className="text-2xl text-[#F5F1E8]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              Outclaw<span className="text-[#F5C542]">.</span>
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-center text-2xl sm:text-3xl text-[#F5F1E8] mb-2"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p
            className="text-center text-sm text-[#F5F1E8]/40 mb-8"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            {mode === "login"
              ? "Sign in to your AI Marketing Command Center"
              : "Get started with 21 specialized marketing agents"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label
                  className="block text-xs text-[#F5F1E8]/40 mb-1.5 uppercase tracking-wider"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                  className="w-full h-12 px-4 bg-[#F5F1E8]/[0.05] border border-[#F5F1E8]/[0.12] text-[#F5F1E8] placeholder-[#F5F1E8]/20 focus:outline-none focus:border-[#F5C542]/50 focus:ring-1 focus:ring-[#F5C542]/25 transition-all"
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
            )}

            <div>
              <label
                className="block text-xs text-[#F5F1E8]/40 mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="w-full h-12 px-4 bg-[#F5F1E8]/[0.05] border border-[#F5F1E8]/[0.12] text-[#F5F1E8] placeholder-[#F5F1E8]/20 focus:outline-none focus:border-[#F5C542]/50 focus:ring-1 focus:ring-[#F5C542]/25 transition-all"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs text-[#F5F1E8]/40 mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Min. 8 characters" : "Enter your password"}
                  required
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  className="w-full h-12 px-4 pr-12 bg-[#F5F1E8]/[0.05] border border-[#F5F1E8]/[0.12] text-[#F5F1E8] placeholder-[#F5F1E8]/20 focus:outline-none focus:border-[#F5C542]/50 focus:ring-1 focus:ring-[#F5C542]/25 transition-all"
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F1E8]/30 hover:text-[#F5F1E8]/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password link (login mode only) */}
            {mode === "login" && (
              <div className="text-right -mt-1">
                <a
                  href="/forgot-password"
                  className="text-xs text-[#F5F1E8]/30 hover:text-[#F5C542] transition-colors"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-60"
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 500,
                background: "#F5C542",
                color: "#0B0D0F",
                borderRadius: 8,
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isPending) e.currentTarget.style.boxShadow = "0 4px 24px rgba(245,197,66,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p
              className="text-sm text-[#F5F1E8]/30"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setPassword("");
                }}
                className="text-[#F5C542] hover:text-[#F5C542]/80 transition-colors font-medium"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <span
            className="text-[11px] text-[#F5F1E8]/15"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            &copy; 2026 Growth Crystal, Inc.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://outmarkhq.com/outclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#F5F1E8]/20 hover:text-[#F5F1E8]/40 transition-colors flex items-center gap-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              About
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://outmarkhq.com/outclaw/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#F5F1E8]/20 hover:text-[#F5F1E8]/40 transition-colors flex items-center gap-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/outmarkhq/outclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#F5F1E8]/20 hover:text-[#F5F1E8]/40 transition-colors flex items-center gap-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
