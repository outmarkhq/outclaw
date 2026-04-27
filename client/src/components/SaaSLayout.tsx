/*
 * SaaS Layout — wraps Command Center and Admin pages.
 * These pages use their own full-screen dark layout, bypassing the docs sidebar.
 */
import { type ReactNode } from "react";

export default function SaaSLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-black">{children}</div>;
}
