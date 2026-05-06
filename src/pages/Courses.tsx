import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
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

export default function Courses() {
  const [search, setSearch] = useState("");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        // @ts-expect-error - Supabase strict typing
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Courses fetch error:", error);
        return [];
      }

      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const filtered = courses.filter(
    (course: any) =>
      (course as any)?.title?.toLowerCase().includes(search.toLowerCase()) ||
      (course as any)?.category?.toLowerCase().includes(search.toLowerCase()),
  );

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
        <div className="grid gap-8 xl:grid-cols-[1fr_360px] xl:items-end">
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
              <span className="section-kicker">Browse Library</span>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="section-title max-w-4xl text-[clamp(3.6rem,10vw,6.4rem)]"
            >
              All{" "}
              <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                Courses
              </span>
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="max-w-2xl text-[0.95rem] leading-[1.8] text-muted-foreground md:text-[1.05rem]"
            >
              Explore our complete library of premium courses designed to
              accelerate your editing career
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="glass-card-strong rounded-[1.8rem] p-4 md:p-5"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/45">
              Search Courses
            </p>
            <div className="glow-input mt-3 rounded-[1.1rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search by title or category..."
                className="pl-11 text-sm md:text-base"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="metric-card">
                <div className="metric-value gradient-text">
                  {filtered.length}
                </div>
                <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/45">
                  Results
                </p>
              </div>
              <div className="metric-card">
                <div className="metric-value text-white">{courses.length}</div>
                <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/45">
                  Total
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="signal-line my-10" />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: item * 0.1 }}
                className="h-[420px] rounded-[2rem] shimmer-skeleton"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence>
              {filtered.map((course: any) => (
                <motion.div
                  key={(course as any)?.id}
                  variants={staggerItem}
                  layout
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.25 },
                  }}
                >
                  <CourseCard course={course as any} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-strong rounded-[2rem] px-6 py-16 text-center"
          >
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <p className="font-display text-5xl text-white tracking-wide">
              No Courses Found
            </p>
            <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-white/42">
              Try a different search term
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
