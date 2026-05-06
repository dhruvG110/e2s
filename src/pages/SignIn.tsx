import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const staggerItem: any = {
  hidden: { opacity: 0, y: 18, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) toast.error(error.message);
    else toast.success("Welcome back!");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) toast.error(error.message);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-28">
      <div className="cinematic-bg" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb left-[-10%] top-[-8%] h-[420px] w-[420px] bg-primary/10" />
        <div
          className="floating-orb bottom-[-10%] right-[-8%] h-[360px] w-[360px] bg-[#7f1f10]/18"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="hero-frame p-8">
            <div className="relative z-10 space-y-6">
              <span className="section-kicker">Welcome Back</span>
              <h1 className="section-title text-[clamp(3.4rem,8vw,5.4rem)] text-white">
                Sign In
                <br />
                <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                  To Continue Learning
                </span>
              </h1>
              <p className="max-w-md text-[0.92rem] leading-[1.8] text-muted-foreground">
                Access your courses, track your progress and keep building the
                editing systems that help you earn.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { value: "500+", label: "Students" },
                  { value: "4.9★", label: "Rating" },
                  { value: "24/7", label: "Access" },
                ].map((stat) => (
                  <div key={stat.label} className="metric-card text-center">
                    <div className="metric-value gradient-text text-[1.6rem]">
                      {stat.value}
                    </div>
                    <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/42">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <Card className="glass-card-strong border-white/10">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[1.6rem] gradient-bg"
              >
                <GraduationCap className="h-7 w-7" />
              </motion.div>
              <CardTitle className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent mt-1">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-[0.82rem]">
                Sign in to continue learning
              </CardDescription>
            </CardHeader>

            <CardContent>
              <motion.form
                onSubmit={handleSignIn}
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={staggerItem} className="space-y-2">
                  <Label className="text-[0.78rem] font-semibold text-white/65">
                    Email
                  </Label>
                  <div className="glow-input rounded-[1.1rem]">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-11 text-sm md:text-base"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <Label className="text-[0.78rem] font-semibold text-white/65">
                    Password
                  </Label>
                  <div className="glow-input rounded-[1.1rem]">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-11 text-sm md:text-base"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Button
                    type="submit"
                    className="gradient-bg glow-button w-full border-transparent text-[0.82rem] font-bold tracking-wide"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Signing In...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/35">
                  Or
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 bg-white/[0.03] text-[0.82rem] font-semibold hover:border-white/18 hover:bg-white/[0.06] transition-all duration-300"
                  onClick={handleGoogleSignIn}
                >
                  Sign In With Google
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="mt-6 text-center text-[0.82rem] text-muted-foreground"
              >
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary transition-colors hover:text-accent"
                >
                  Sign Up
                </Link>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
