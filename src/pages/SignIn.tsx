import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { GraduationCap, Mail, Lock } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect when user is authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />

      <Card className="relative w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue learning</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative glow-input rounded-lg">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 bg-secondary border-border" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative glow-input rounded-lg">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 bg-secondary border-border" placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-bg glow-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Button variant="outline" className="w-full border-border" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
