import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  AtSign,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: form.name,
          username: form.username,
          phone: form.phone,
        },
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
      options: { redirectTo: window.location.origin },
    });

    if (error) toast.error(error.message);
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text" },
    { key: "username", label: "Username", icon: AtSign, type: "text" },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "email", label: "Email", icon: Mail, type: "email" },
    { key: "password", label: "Password", icon: Lock, type: "password" },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Cinematic background */}
      <div className="cinematic-bg" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          <CardHeader className="text-center space-y-3">
            <GraduationCap className="mx-auto h-10 w-10 text-accent" />
            <CardTitle className="text-2xl font-bold gradient-text">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Start your learning journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-3">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  <div className="relative glow-input rounded-lg">
                    <f.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-10 bg-secondary border-border"
                      type={f.type}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => update(f.key, e.target.value)}
                      required={f.key !== "phone" && f.key !== "username"}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="submit"
                className="w-full gradient-bg glow-button mt-2"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-border" />
            </div>

            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary"
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}