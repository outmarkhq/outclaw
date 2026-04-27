import { useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Lock, CheckCircle, AlertTriangle } from "lucide-react";

export default function ResetPassword() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    resetMutation.mutate({ token, password });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Invalid reset link</h1>
          <p className="text-white/40 text-sm mb-6">
            This password reset link is missing or malformed. Please request a new one.
          </p>
          <Link href="/forgot-password">
            <Button className="bg-[oklch(0.87_0.29_142)] text-black font-bold hover:brightness-110">
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.87_0.29_142)]/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[oklch(0.87_0.29_142)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Password updated</h1>
            <p className="text-white/40 text-sm mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link href="/login">
              <Button className="bg-[oklch(0.87_0.29_142)] text-black font-bold hover:brightness-110">
                Sign in
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <Link href="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Set new password</h1>
              <p className="text-white/40 text-sm">
                Choose a strong password for your account. Must be at least 8 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="password" className="text-white/60 text-sm">New password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-[oklch(0.87_0.29_142)] focus:ring-[oklch(0.87_0.29_142)]/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm" className="text-white/60 text-sm">Confirm password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input
                    id="confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    minLength={8}
                    className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-[oklch(0.87_0.29_142)] focus:ring-[oklch(0.87_0.29_142)]/20"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                disabled={resetMutation.isPending || !password || !confirmPassword}
                className="w-full bg-[oklch(0.87_0.29_142)] text-black font-bold hover:brightness-110 disabled:opacity-50"
              >
                {resetMutation.isPending ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
