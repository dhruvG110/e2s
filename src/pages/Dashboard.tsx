import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.16 },
  },
};

const staggerItem: any = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const formatCurrency = (value: number) =>
  `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

const formatShortName = (user: any) => {
  const fromProfile = user?.user_metadata?.full_name as string | undefined;
  if (fromProfile?.trim()) return fromProfile.trim().split(" ")[0];

  const fromEmail = user?.email as string | undefined;
  if (fromEmail?.trim()) return fromEmail.trim().split("@")[0];

  return "Creator";
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: purchases } = useQuery({
    queryKey: ["my-purchases", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*, courses(*)")
        // @ts-expect-error - Supabase strict typing
        .eq("user_id", user!.id)
        .gte("expires_at", new Date().toISOString());

      return data ?? [];
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-strong rounded-[2rem] px-8 py-10 text-center"
        >
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/42">
            Loading Dashboard
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" />;

  const purchasedCourses =
    purchases?.map((purchase: any) => purchase.courses).filter(Boolean) ?? [];
  const activeAccess = purchases?.length ?? 0;
  const totalSpent =
    purchases?.reduce(
      (sum: number, purchase: any) => sum + (purchase.amount_paid ?? 0),
      0,
    ) ?? 0;
  const learnerName = formatShortName(user);
  const learningScore = Math.min(
    100,
    purchasedCourses.length * 22 + activeAccess * 10,
  );
  const nextMilestone =
    purchasedCourses.length >= 3
      ? "You unlocked your core learning stack. Keep building momentum."
      : `Add ${3 - purchasedCourses.length} more course${
          3 - purchasedCourses.length > 1 ? "s" : ""
        } to complete your starter stack.`;

  const stats = [
    { label: "Courses", value: purchasedCourses.length, icon: BookOpen },
    {
      label: "Active Access",
      value: activeAccess,
      icon: CheckCircle2,
    },
    { label: "Invested", value: formatCurrency(totalSpent), icon: Wallet },
    { label: "Momentum", value: `${learningScore}%`, icon: TrendingUp },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 pt-28">
      <div className="cinematic-bg" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb left-[-8%] top-[-8%] h-[380px] w-[380px] bg-primary/8" />
        <div
          className="floating-orb bottom-[-10%] right-[-6%] h-[320px] w-[320px] bg-[#7f1f10]/15"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="space-y-5"
          >
            <motion.div variants={staggerItem}>
              <span className="section-kicker">Your Learning Hub</span>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="section-title max-w-4xl text-[clamp(3.6rem,10vw,6.2rem)]"
            >
              Hey {learnerName},{" "}
              <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                Let's Build
              </span>
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="max-w-2xl text-[0.95rem] leading-[1.8] text-muted-foreground md:text-[1.05rem]"
            >
              Your enrolled courses, progress momentum and the next steps in
              your editing journey.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="hero-frame max-w-2xl rounded-[1.6rem] p-5 md:p-6"
            >
              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/50">
                    Current Momentum
                  </p>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary/90">
                    Learning Score {learningScore}%
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${learningScore}%` }}
                    transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#ff5c00] via-[#d946ef] to-[#8b5cf6]"
                  />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {nextMilestone}
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="metric-card group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08, duration: 0.45 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-primary/25 group-hover:bg-primary/[0.06]">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="metric-value gradient-text">{stat.value}</div>
                <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-white/42">
                  {stat.label}
                </p>
              </motion.div>
            ))}

            <motion.div
              className="hero-frame sm:col-span-2 rounded-[1.5rem] p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
            >
              <div className="relative z-10">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/44">
                  Quick Actions
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    className="gradient-bg glow-button border-transparent text-[0.72rem] font-bold uppercase tracking-[0.15em]"
                    onClick={() => navigate("/courses")}
                  >
                    Browse Catalog
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/15 bg-white/[0.03] text-[0.72rem] font-bold uppercase tracking-[0.15em] hover:bg-white/[0.08]"
                    onClick={() => {
                      if (purchasedCourses.length > 0) {
                        navigate(`/course/${purchasedCourses[0].id}`);
                        return;
                      }
                      navigate("/courses");
                    }}
                  >
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="signal-line my-10" />

        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-white/44">
              Library
            </p>
            <h2 className="mt-2 text-3xl text-white sm:text-4xl">
              Your Courses
            </h2>
          </div>
          <Button
            variant="outline"
            className="hidden border-white/15 bg-white/[0.02] text-[0.68rem] font-bold uppercase tracking-[0.2em] md:inline-flex"
            onClick={() => navigate("/courses")}
          >
            Get More Courses
          </Button>
        </div>

        {purchasedCourses.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {purchasedCourses.map((course: any) => (
              <motion.div key={course.id} variants={staggerItem}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="hero-frame mx-auto max-w-3xl p-6 md:p-10"
          >
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/[0.04]"
              >
                <BookOpen className="h-9 w-9 text-primary" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white tracking-wide">
                No Courses Yet
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[0.92rem] leading-[1.8] text-muted-foreground">
                Browse our catalog to start your editing journey and unlock your
                first learning path.
              </p>
              <Button
                size="lg"
                className="gradient-bg glow-button mt-8 border-transparent text-[0.82rem] font-bold tracking-wide"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
