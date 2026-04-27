/**
 * Outclaw — App Entry
 * Pure SaaS gate: unauthenticated → branded sign-in, authenticated → redirect to /cc or /onboarding
 */
import { useAuth } from "@/_core/hooks/useAuth";

import { trpc } from "@/lib/trpc";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Check if authenticated user already has a workspace
  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: isAuthenticated === true,
    retry: false,
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (workspacesQuery.data !== undefined) {
        if (workspacesQuery.data.length > 0) {
          setLocation("/cc");
        } else {
          setLocation("/onboarding");
        }
      }
    }
  }, [loading, isAuthenticated, workspacesQuery.data, setLocation]);

  // Show spinner while auth is resolving or user is authenticated (about to redirect)
  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D0F]">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#F5C542 transparent #F5C542 #F5C542" }}
        />
      </div>
    );
  }

  // Unauthenticated — show branded sign-in gate
  return (
    <div className="min-h-screen bg-[#0B0D0F] flex flex-col">
      {/* Main content — vertically centered */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#F5C542] flex items-center justify-center rounded-sm">
              <span className="text-[#0B0D0F] font-extrabold text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                O
              </span>
            </div>
            <span
              className="text-2xl text-[#F5F1E8]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.02em" }}
            >
              Outclaw<span className="text-[#F5C542]">.</span>
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl text-[#F5F1E8] mb-3"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.15 }}
          >
            AI Marketing<br />Command Center
          </h1>
          <p
            className="text-sm text-[#F5F1E8]/40 mb-10 max-w-sm mx-auto"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, lineHeight: 1.6 }}
          >
            21 specialized agents. Structured briefs. One unified platform.
          </p>

          {/* Sign in button */}
          <button
            onClick={() => setLocation("/login")}
            className="w-full h-12 flex items-center justify-center gap-2 text-sm transition-all mb-4"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 500,
              background: "#F5C542",
              color: "#0B0D0F",
              borderRadius: 8,
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(245,197,66,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            Sign in to get started
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary info */}
          <p className="text-xs text-[#F5F1E8]/20" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            No account? You can create one on the next page.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <span className="text-[11px] text-[#F5F1E8]/15" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
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
