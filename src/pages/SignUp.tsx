import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AtSign,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const staggerItem: any = {
  hidden: { opacity: 0, y: 18, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as any },
  },
};

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

  const update = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
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
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) toast.error(error.message);
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      type: "text",
      placeholder: "John Doe",
    },
    {
      key: "username",
      label: "Username",
      icon: AtSign,
      type: "text",
      placeholder: "johndoe",
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      placeholder: "+91 9876543210",
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      type: "email",
      placeholder: "you@example.com",
    },
    {
      key: "password",
      label: "Password",
      icon: Lock,
      type: "password",
      placeholder: "Create a strong password",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-28">
      <div className="cinematic-bg" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb right-[-10%] top-[-10%] h-[420px] w-[420px] bg-primary/10" />
        <div
          className="floating-orb bottom-[-10%] left-[-8%] h-[360px] w-[360px] bg-[#7f1f10]/18"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="hero-frame p-8">
            <div className="relative z-10 space-y-6">
              <span className="section-kicker">Create Account</span>
              <h1 className="section-title text-[clamp(3.4rem,8vw,5.4rem)] text-white">
                Start Your
                <br />
                <span className="bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                  Editing And Earning Journey
                </span>
              </h1>
              <p className="max-w-md text-[0.92rem] leading-[1.8] text-muted-foreground">
                Build your profile, unlock the course library and start turning
                your editing skill into real momentum.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Access to premium editing courses",
                  "Real-world project workflows",
                  "Community of 500+ creators",
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 text-[0.85rem] text-white/65"
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </span>
                    {item}
                  </motion.div>
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
                Create Account
              </CardTitle>
              <CardDescription className="text-[0.82rem]">
                Start your editing and earning journey
              </CardDescription>
            </CardHeader>

            <CardContent>
              <motion.form
                onSubmit={handleSignUp}
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {fields.map((field) => (
                  <motion.div
                    key={field.key}
                    variants={staggerItem}
                    className="space-y-1.5"
                  >
                    <Label className="text-[0.75rem] font-semibold text-white/60">
                      {field.label}
                    </Label>
                    <div className="glow-input rounded-[1.1rem]">
                      <field.icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="pl-11 text-sm md:text-base"
                        value={form[field.key as keyof typeof form]}
                        onChange={(event) =>
                          update(field.key, event.target.value)
                        }
                        required={
                          field.key !== "phone" && field.key !== "username"
                        }
                      />
                    </div>
                  </motion.div>
                ))}

                <motion.div variants={staggerItem} className="pt-1">
                  <Button
                    type="submit"
                    className="gradient-bg glow-button w-full border-transparent text-[0.82rem] font-bold tracking-wide"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign Up
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/35">
                  Or
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 bg-white/[0.03] text-[0.82rem] font-semibold hover:border-white/18 hover:bg-white/[0.06] transition-all duration-300"
                  onClick={handleGoogleSignUp}
                >
                  Sign Up With Google
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mt-5 text-center text-[0.82rem] text-muted-foreground"
              >
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-primary transition-colors hover:text-accent"
                >
                  Sign In
                </Link>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
