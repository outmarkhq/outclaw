import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => setSent(true),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    forgotMutation.mutate({
      email,
      origin: window.location.origin,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.87_0.29_142)]/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[oklch(0.87_0.29_142)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              If an account exists for <span className="text-white/60">{email}</span>, we've sent a password reset link. It expires in 1 hour.
            </p>
            <p className="text-white/30 text-xs">
              Didn't receive it? Check your spam folder or{" "}
              <button
                onClick={() => { setSent(false); setError(""); }}
                className="text-[oklch(0.87_0.29_142)] hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
              <p className="text-white/40 text-sm">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-white/60 text-sm">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-[oklch(0.87_0.29_142)] focus:ring-[oklch(0.87_0.29_142)]/20"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                disabled={forgotMutation.isPending || !email}
                className="w-full bg-[oklch(0.87_0.29_142)] text-black font-bold hover:brightness-110 disabled:opacity-50"
              >
                {forgotMutation.isPending ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
