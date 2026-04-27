/*
 * Login / Signup — Outclaw SaaS
 * Design: sim.ai-inspired — dark, minimal, neon green accent
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const ok = await login(email, password);
        if (ok) {
          setLocation("/command-center/dashboard");
        } else {
          setError("Invalid credentials. Try admin@command.outmarkhq.com / admin");
        }
      } else {
        const ok = await signup(name, email, password, workspace);
        if (ok) {
          setLocation("/command-center/dashboard");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left: Hero */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663306550909/iuGjwtGPwe2tLuJLPpTZVn/command-center-bg-6kXnrr9jUzxJJPicXXLw5t.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-16 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#F5C542] flex items-center justify-center">
              <span className="text-black font-extrabold text-lg">O</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Outclaw</span>
          </div>
          <h1 className="text-white text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Your AI Marketing<br />Command Center
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            21 specialized agents. One unified platform. Deploy your AI marketing team in minutes.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-[#F5C542] flex items-center justify-center">
              <span className="text-black font-extrabold text-sm">O</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Outclaw</span>
          </div>

          <h2 className="text-white text-2xl font-bold tracking-tight mb-1">
            {mode === "login" ? "Sign in to your workspace" : "Create your workspace"}
          </h2>
          <p className="text-white/40 text-sm mb-8">
            {mode === "login"
              ? "Enter your credentials to access Command Center"
              : "Set up your AI marketing team in 2 minutes"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542] transition-colors"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542] transition-colors"
                    placeholder="My Company Marketing"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542] transition-colors"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#F5C542] transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5C542] text-black font-bold py-3 text-sm hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? "..." : mode === "login" ? "Sign In" : "Create Workspace"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {mode === "login" && (
            <div className="mt-8 p-4 border border-white/[0.06] bg-white/[0.02]">
              <p className="text-white/30 text-xs font-medium mb-2 uppercase tracking-wider">Demo Accounts</p>
              <div className="space-y-1.5 text-xs">
                <p className="text-white/50">
                  <span className="text-[#F5C542]">Admin:</span>{" "}
                  admin@command.outmarkhq.com / admin
                </p>
                <p className="text-white/50">
                  <span className="text-[#F5C542]">Member:</span>{" "}
                  sarah@acme.com / demo
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
