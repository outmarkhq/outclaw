/*
 * Outclaw — DocPage wrapper
 * Branding aligned with Outmark: warm dark header, gold accent, Fraunces/IBM Plex fonts
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";

const C = {
  bg: "#0B0D0F",
  bgRaised: "#111317",
  fg: "#F5F1E8",
  fgDim: "rgba(245,241,232,0.62)",
  fgFaint: "rgba(245,241,232,0.35)",
  fgMuted: "rgba(245,241,232,0.18)",
  accent: "#F5C542",
  rule: "rgba(245,241,232,0.12)",
};

interface DocPageProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  children: React.ReactNode;
  prevPage?: { path: string; label: string };
  nextPage?: { path: string; label: string };
}

export default function DocPage({ title, subtitle, icon, children, prevPage, nextPage }: DocPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      {/* Page header */}
      <div style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="container py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {icon && (
              <div className="mb-4" style={{ color: C.accent }}>{icon}</div>
            )}
            <h1
              className="text-3xl lg:text-[2.75rem] leading-tight mb-2"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                color: C.fg,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-base lg:text-lg max-w-2xl leading-relaxed"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}
              >
                {subtitle}
              </p>
            )}
            {/* Gold accent bar */}
            <div className="mt-6 h-[2px] w-16" style={{ background: C.accent }} />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1" style={{ background: C.bgRaised }}>
        <div className="container py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="prose-docs max-w-4xl"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Prev / Next */}
      {(prevPage || nextPage) && (
        <div style={{ borderTop: `1px solid ${C.rule}`, background: C.bgRaised }}>
          <div className="container py-6">
            <div className="flex justify-between items-center">
              {prevPage ? (
                <Link href={prevPage.path}>
                  <span
                    className="inline-flex items-center gap-2 text-sm transition-colors"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 400, color: C.fgFaint }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.fgFaint)}
                  >
                    <ArrowLeft size={14} /> {prevPage.label}
                  </span>
                </Link>
              ) : <div />}
              {nextPage ? (
                <Link href={nextPage.path}>
                  <span
                    className="inline-flex items-center gap-2 text-sm transition-colors"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 400, color: C.fgFaint }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.fgFaint)}
                  >
                    {nextPage.label} <ArrowRight size={14} />
                  </span>
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.rule}`, background: C.bg }}>
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-[12px]"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}
          >
            Outclaw Documentation
          </span>
          <div className="flex gap-6">
            <Link
              href="/getting-started"
              className="text-[12px] transition-colors"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fgDim)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.fgMuted)}
            >
              Get Started
            </Link>
            <Link
              href="/faq"
              className="text-[12px] transition-colors"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fgDim)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.fgMuted)}
            >
              FAQ
            </Link>
            <a
              href="https://github.com/outmarkhq/alphaclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] transition-colors"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fgDim)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.fgMuted)}
            >
              AlphaClaw Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
