import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap, Mail, Lock, User, Phone, AtSign } from "lucide-react";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", username: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name: form.name, username: form.username, phone: form.phone },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm your account!");
      navigate("/signin");
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) toast.error(error.message);
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
    { key: "username", label: "Username", icon: AtSign, type: "text", placeholder: "johndoe" },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+91 9876543210" },
    { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", icon: Lock, type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20 pb-10">
      <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

      <Card className="relative w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Create Account</CardTitle>
          <CardDescription>Start your learning journey today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">
            {fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">{f.label}</Label>
                <div className="relative glow-input rounded-lg">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 bg-secondary border-border"
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => update(f.key, e.target.value)}
                    required={f.key !== "phone" && f.key !== "username"}
                  />
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full gradient-bg glow-button mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Button variant="outline" className="w-full border-border" onClick={handleGoogleSignUp}>
            Sign up with Google
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
