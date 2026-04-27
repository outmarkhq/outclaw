/*
 * Outclaw — Layout
 * Branding aligned with Outmark: warm dark sidebar, gold accent, Fraunces/IBM Plex fonts
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  BookOpen,
  Layers,
  Users,
  Rocket,
  Monitor,
  Package,
  AlertTriangle,
  HelpCircle,
  Settings,
  Menu,
  X,
  FileText,
  Cpu,
} from "lucide-react";

/* Outmark palette */
const C = {
  bg: "#0B0D0F",
  bgRaised: "#111317",
  fg: "#F5F1E8",
  fgDim: "rgba(245,241,232,0.62)",
  fgFaint: "rgba(245,241,232,0.35)",
  fgMuted: "rgba(245,241,232,0.18)",
  accent: "#F5C542",
  accentDim: "rgba(245,197,66,0.15)",
  rule: "rgba(245,241,232,0.12)",
};

const navItems = [
  { path: "/", label: "Overview", icon: Compass, section: null },
  { path: "/getting-started", label: "Getting Started", icon: BookOpen, section: "Guides" },
  { path: "/architecture", label: "Architecture", icon: Layers, section: "Guides" },
  { path: "/agents", label: "Agent Roster", icon: Users, section: "Guides" },
  { path: "/gaccs", label: "GACCS Briefs", icon: FileText, section: "Guides" },
  { path: "/deployment", label: "Deployment", icon: Rocket, section: "Guides" },
  { path: "/command-center", label: "Command Center", icon: Monitor, section: "Guides" },
  { path: "/models", label: "Model Strategy", icon: Cpu, section: "Reference" },
  { path: "/operations", label: "Operations", icon: Settings, section: "Reference" },
  { path: "/dependencies", label: "Dependencies", icon: Package, section: "Reference" },
  { path: "/troubleshooting", label: "Troubleshooting", icon: AlertTriangle, section: "Reference" },
  { path: "/faq", label: "FAQ", icon: HelpCircle, section: "Reference" },
];

function NavLink({ item, onClick }: { item: (typeof navItems)[0]; onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === item.path;
  const Icon = item.icon;

  return (
    <Link href={item.path} onClick={onClick}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 text-[13px] transition-all duration-150"
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: isActive ? 500 : 300,
          color: isActive ? C.accent : C.fgFaint,
          background: isActive ? C.accentDim : "transparent",
          borderRadius: 2,
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.color = C.fgDim;
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = C.fgFaint;
        }}
      >
        <Icon size={15} className="flex-shrink-0" style={{ color: isActive ? C.accent : undefined }} />
        <span className="truncate">{item.label}</span>
      </div>
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const guidesItems = navItems.filter((i) => i.section === "Guides");
  const referenceItems = navItems.filter((i) => i.section === "Reference");
  const overviewItem = navItems.find((i) => i.section === null)!;

  const sidebar = (
    <nav className="flex flex-col h-full" style={{ background: C.bg }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center gap-3">
            <span
              className="text-xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: C.fg }}
            >
              Outclaw<span style={{ color: C.accent }}>.</span>
            </span>
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.06em] mt-0.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: C.fgMuted }}
          >
            Documentation
          </div>
        </Link>
      </div>

      <div className="mx-4 mb-4" style={{ height: 1, background: C.rule }} />

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-4">
        <div>
          <NavLink item={overviewItem} onClick={() => setMobileOpen(false)} />
        </div>

        <div>
          <div
            className="px-3 mb-2 text-[10px] uppercase tracking-[0.06em]"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.fgMuted }}
          >
            Guides
          </div>
          <div className="space-y-px">
            {guidesItems.map((item) => (
              <NavLink key={item.path} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>

        <div>
          <div
            className="px-3 mb-2 text-[10px] uppercase tracking-[0.06em]"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.fgMuted }}
          >
            Reference
          </div>
          <div className="space-y-px">
            {referenceItems.map((item) => (
              <NavLink key={item.path} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: `1px solid ${C.rule}` }}>
        <div
          className="text-[10px] tracking-[0.04em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: C.fgMuted }}
        >
          Built on AlphaClaw
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block w-[240px] shrink-0 fixed top-0 left-0 h-screen z-30 overflow-hidden"
        style={{ background: C.bg, borderRight: `1px solid ${C.rule}` }}
      >
        {sidebar}
      </aside>

      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4"
        style={{ background: C.bg, borderBottom: `1px solid ${C.rule}` }}
      >
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 -ml-1 transition-colors"
          style={{ color: C.fg, borderRadius: 4 }}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/" className="flex items-center gap-2 ml-2">
          <span
            className="text-sm"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: C.fg }}
          >
            Outclaw<span style={{ color: C.accent }}>.</span>
          </span>
        </Link>
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "rgba(11,13,15,0.6)", backdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="lg:hidden fixed top-0 left-0 w-[260px] h-screen z-50 shadow-2xl"
              style={{ background: C.bg }}
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-[240px] min-h-screen pt-14 lg:pt-0 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
