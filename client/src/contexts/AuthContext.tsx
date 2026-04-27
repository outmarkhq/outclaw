/*
 * Auth Context — manages login state for the SaaS platform prototype.
 * Supports admin and member roles.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "admin" | "member";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaceId: string;
  workspaceName: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, workspaceName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo accounts
const DEMO_ACCOUNTS: Record<string, AuthUser & { password: string }> = {
  "admin@command.outmarkhq.com": {
    id: "u-admin",
    name: "Platform Admin",
    email: "admin@command.outmarkhq.com",
    role: "admin",
    workspaceId: "ws-000",
    workspaceName: "Outclaw HQ",
    password: "admin",
  },
  "sarah@acme.com": {
    id: "u-001",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    role: "member",
    workspaceId: "ws-001",
    workspaceName: "Acme Corp Marketing",
    password: "demo",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (account && account.password === password) {
      const { password: _, ...userData } = account;
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string, workspaceName: string): Promise<boolean> => {
    setUser({
      id: `u-${Date.now()}`,
      name,
      email,
      role: "member",
      workspaceId: `ws-${Date.now()}`,
      workspaceName,
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
