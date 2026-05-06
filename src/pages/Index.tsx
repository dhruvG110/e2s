import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Plus,
  Quote,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import logoImg from "@/assets/logo_image.png";

const testimonialsText = [
  {
    name: "Priyanshu Verma",
    role: "Content Creator | YouTube Educator",
    text: '"I always struggled with CapCut consistency. MarketMix gave me real-world workflows and templates that instantly improved my edits and confidence."',
  },
  {
    name: "Rahul Sharma",
    role: "Freelance Video Editor",
    text: '"Edit2Scale completely transformed my editing career. I went from struggling to find clients to having a waitlist within 3 months!"',
  },
  {
    name: "Priya Patel",
    role: "Content Creator",
    text: '"The Alight Motion course is insanely detailed. I learned techniques that took my reels from 100 views to 100K+ views."',
  },
];

const courses = [
  {
    title: "CapCut Pro Editing",
    description:
      "Professional video editing, transitions, effects and color grading",
    image:
      "https://p16-capcut-cms-sg-useast5.capcutcdn-us.com/tos-useast5-i-6rr7idwo9f-tx/1726022635146.image~tplv-6rr7idwo9f-image.image",
    originalPrice: "Rs. 4,999",
    price: "Rs. 1,999",
  },
  {
    title: "Alight Motion",
    description: "Motion graphics, transitions, VFX and real-world projects",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&h=720&fit=crop",
    originalPrice: "Rs. 6,999",
    price: "Rs. 2,999",
  },
  {
    title: "How to Find Clients and Scale",
    description:
      "Client acquisition strategies, pricing and scaling your editing services",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=720&fit=crop",
    originalPrice: "Rs. 9,999",
    price: "Rs. 3,999",
  },
];

// const floatingIcons = [
//   {
//     name: "CapCut",
//     url: "https://www.capcut.com",
//     logoUrl: "https://play-lh.googleusercontent.com/M78HyakHaxKrjoeqYx41E9DXfVYYtx67nvc7Ks4G4zFQeaAJdGCi8gzzGSrHIwlrmnJS6zD9S4fAXqdEwfuHQAQ=w240-h480-rw",
//     bg: "linear-gradient(135deg, #000000 0%, #333333 100%)",
//     pos: { top: "20%", left: "8%" },
//     delay: 0.8
//   },
//   {
//     name: "Alight Motion",
//     url: "https://alightmotion.com",
//     logoUrl: "https://play-lh.googleusercontent.com/OU0BlP8C9-V7ECl2crma7B48nzDbK7liSLjn0j_fpTlyWG6qyEE-mw_KFZ9aOXF0a3w",
//     bg: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
//     pos: { top: "40%", right: "10%" },
//     delay: 1.1
//   },
// ];

const searchTags = [
  "Shake Effect",
  "Glow Effect",
  "Beat Sync",
  "Auto Captions",
];

const trustBadges = [
  { icon: Users, value: "500+", label: "Students" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: TrendingUp, value: "95%", label: "Growth" },
];

const checklist = [
  "Master Alight Motion and CapCut like a pro",
  "Real project-based editing workflows",
  "Learn client acquisition and monetization",
];

const heroHighlights = [
  {
    title: "Real Projects",
    description: "Hands-on workflows built around creator-style edits",
  },
  {
    title: "Premium Assets",
    description: "Templates, overlays and packs ready for production",
  },
  {
    title: "Client Scaling",
    description: "Systems that turn editing skill into real income",
  },
];

const creatorStats = [
  { value: trustBadges[0].value, label: "Active students" },
  { value: `${searchTags.length}+`, label: "Asset styles" },
  { value: `${courses.length}`, label: "Core tracks" },
];

const creatorPreviewVideoSrc = "/videos/creator-preview.mp4";

const tickerItems = [
  ...searchTags,
  ...trustBadges.map((badge) => `${badge.value} ${badge.label}`),
  ...courses.map((course) => course.title),
  "Structured Learning System",
];

const introParticles = [
  {
    top: "8%",
    left: "5%",
    size: 5,
    color: "rgba(168, 85, 247, 0.9)",
    glow: "0 0 16px rgba(168,85,247,0.45)",
  },
  {
    top: "12%",
    left: "34%",
    size: 4,
    color: "rgba(249, 115, 22, 0.92)",
    glow: "0 0 18px rgba(249,115,22,0.48)",
  },
  {
    top: "15%",
    left: "71%",
    size: 5,
    color: "rgba(192, 132, 252, 0.95)",
    glow: "0 0 16px rgba(192,132,252,0.42)",
  },
  {
    top: "21%",
    left: "86%",
    size: 7,
    color: "rgba(147, 51, 234, 0.95)",
    glow: "0 0 18px rgba(147,51,234,0.5)",
  },
  {
    top: "28%",
    left: "11%",
    size: 10,
    color: "rgba(249, 115, 22, 0.9)",
    glow: "0 0 28px rgba(249,115,22,0.55)",
  },
  {
    top: "32%",
    left: "65%",
    size: 5,
    color: "rgba(217, 70, 239, 0.95)",
    glow: "0 0 16px rgba(217,70,239,0.45)",
  },
  {
    top: "38%",
    left: "78%",
    size: 11,
    color: "rgba(249, 115, 22, 0.88)",
    glow: "0 0 28px rgba(249,115,22,0.52)",
  },
  {
    top: "46%",
    left: "18%",
    size: 4,
    color: "rgba(168, 85, 247, 0.9)",
    glow: "0 0 14px rgba(168,85,247,0.45)",
  },
  {
    top: "52%",
    left: "58%",
    size: 8,
    color: "rgba(249, 115, 22, 0.9)",
    glow: "0 0 20px rgba(249,115,22,0.5)",
  },
  {
    top: "61%",
    left: "89%",
    size: 12,
    color: "rgba(249, 115, 22, 0.86)",
    glow: "0 0 32px rgba(249,115,22,0.48)",
  },
  {
    top: "67%",
    left: "8%",
    size: 6,
    color: "rgba(168, 85, 247, 0.95)",
    glow: "0 0 16px rgba(168,85,247,0.42)",
  },
  {
    top: "74%",
    left: "28%",
    size: 4,
    color: "rgba(192, 132, 252, 0.92)",
    glow: "0 0 14px rgba(192,132,252,0.38)",
  },
  {
    top: "82%",
    left: "69%",
    size: 7,
    color: "rgba(147, 51, 234, 0.92)",
    glow: "0 0 16px rgba(147,51,234,0.4)",
  },
  {
    top: "88%",
    left: "54%",
    size: 5,
    color: "rgba(249, 115, 22, 0.86)",
    glow: "0 0 18px rgba(249,115,22,0.45)",
  },
];

const introTrails = [
  { top: "4.5rem", left: "68%", width: 150, rotation: 50, duration: 5.5 },
  { top: "10rem", left: "82%", width: 186, rotation: 52, duration: 6.3 },
  { top: "18rem", left: "74%", width: 148, rotation: 49, duration: 5.8 },
];

const faqItems = [
  {
    question: "What editing software do the courses cover?",
    answer:
      "Our courses cover CapCut Pro and Alight Motion in depth. You'll learn everything from basic editing to advanced motion graphics, VFX, transitions, and color grading — all with real-world project workflows.",
  },
  {
    question: "Do I need any prior editing experience?",
    answer:
      "Not at all! Our courses are designed for all skill levels. Whether you're a complete beginner or an experienced editor looking to level up, the structured learning path adapts to your pace.",
  },
  {
    question: "How long do I have access to the courses?",
    answer:
      "You get lifetime access to all purchased courses. Once enrolled, you can watch the lessons as many times as you want, at your own pace, forever. No expiration dates.",
  },
  {
    question: "Will I learn how to get clients as a video editor?",
    answer:
      "Yes! Our 'How to Find Clients and Scale' course covers everything — from building your portfolio, pricing strategies, client outreach, to scaling your editing business to consistent income.",
  },
  {
    question: "What's included in the bundle deal?",
    answer:
      "The complete bundle gives you access to all 3 courses (CapCut Pro Editing, Alight Motion, and Client Scaling) at a massive discount. You also get bonus templates, presets, and community access.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with a course within the first 7 days of purchase, reach out to us for a full refund — no questions asked.",
  },
  {
    question: "Do I get any templates or assets with the courses?",
    answer:
      "Absolutely! Each course comes with premium templates, overlays, presets, and project files that you can use directly in your own projects to save time and produce professional results.",
  },
];

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 40;
    const step = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const displayValue = Number.isInteger(numericValue)
    ? Math.round(count)
    : count.toFixed(1);
  const textSuffix = value.replace(/[0-9.]/g, "") || suffix;

  return (
    <span ref={ref}>{isInView ? `${displayValue}${textSuffix}` : "0"}</span>
  );
}

function FAQItem({
  item,
  index,
}: {
  item: { question: string; answer: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`faq-item ${open ? "" : ""}`}
      data-state={open ? "open" : "closed"}
    >
      <button
        type="button"
        className="faq-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{item.question}</span>
        <motion.span
          className="faq-icon"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="faq-content">{item.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const fadeInUp: any = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const slideInLeft: any = {
  hidden: { opacity: 0, x: -70, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const slideInRight: any = {
  hidden: { opacity: 0, x: 70, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
  },
};
const premiumFadeIn = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export default function Index() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : -60],
  );
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.6],
    [1, shouldReduceMotion ? 1 : 0],
  );
  const heroParticles = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, index) => ({
        key: index,
        className: `${index % 6 === 0 ? "big" : "small"} ${index % 4 === 0 ? "square" : "circle"} ${index % 3 === 0 ? "orange" : index % 3 === 1 ? "purple" : "magenta"}`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * -20}s`,
        animationDuration: `${12 + Math.random() * 12}s`,
      })),
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((c) => (c + 1) % testimonialsText.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () =>
    setCurrentTestimonial((current) => (current + 1) % testimonialsText.length);

  const prevTestimonial = () =>
    setCurrentTestimonial(
      (current) =>
        (current - 1 + testimonialsText.length) % testimonialsText.length,
    );

  const scrollToDetails = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      <div className="cinematic-bg" />

      <div className="particles-bg pointer-events-none">
        {heroParticles.map((particle) => (
          <span
            key={particle.key}
            className={`particle ${particle.className}`}
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>

      <ParticleBackground />

      <section className="relative z-10 min-h-[100svh] overflow-hidden border-b border-white/8 pt-24 md:pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-white/6" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_58%)]" />
          <div className="absolute left-[14%] top-[28%] h-28 w-28 rounded-full bg-[#ff6a1f]/14 blur-3xl" />
          <div className="absolute right-[14%] top-[8%] h-36 w-36 rounded-full bg-[#8f1fff]/10 blur-3xl" />
          <div className="absolute bottom-[14%] left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,64,129,0.14),rgba(137,31,255,0.05)_55%,transparent_72%)] blur-3xl" />

          {introTrails.map((trail, index) => (
            <motion.div
              key={`${trail.top}-${trail.left}`}
              className="absolute"
              style={{
                top: trail.top,
                left: trail.left,
                rotate: `${trail.rotation}deg`,
              }}
              animate={{ opacity: [0.25, 0.7, 0.3] }}
              transition={{
                duration: trail.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.4,
              }}
            >
              <span
                className="block h-px rounded-full bg-gradient-to-r from-transparent via-[#6f22d9]/55 to-[#b487ff]/80"
                style={{ width: trail.width }}
              />
              <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#ba8cff] shadow-[0_0_18px_rgba(186,140,255,0.8)]" />
            </motion.div>
          ))}

          {introParticles.map((particle, index) => (
            <motion.span
              key={`${particle.top}-${particle.left}`}
              className="absolute rounded-full"
              style={{
                top: particle.top,
                left: particle.left,
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: particle.glow,
              }}
              animate={{
                opacity: [0.35, 1, 0.45],
                scale: [0.85, 1.1, 0.9],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3.8 + (index % 4) * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.14,
              }}
            />
          ))}
        </div>

        {/* ═══ FLOATING ICONS ═══ */}
        {/* <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
  {floatingIcons.map((icon) => (
    <motion.a
      key={icon.name}
      href={icon.url}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute pointer-events-auto flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 lg:h-[4.4rem] lg:w-[4.4rem] rounded-2xl shadow-[0_18px_42px_rgba(0,0,0,0.26)] overflow-hidden"
      style={{
        ...icon.pos,
        background: icon.bg,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -20, 0] 
      }}
      transition={{
        opacity: { delay: icon.delay, duration: 0.8 },
        scale: { delay: icon.delay, duration: 0.8 },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: icon.delay 
        }
      }}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        filter: "brightness(1.1)",
      }}
    >
      <img
        src={icon.logoUrl}
        alt={icon.name}
        className="h-full w-full object-cover scale-110"
      />
    </motion.a>
  ))}
</div> */}
        {/* Intro Logo & Title */}

        <div className="container relative mx-auto flex min-h-[calc(100svh-6rem)] flex-col justify-between px-15 pb-10 md:pb-12">
          <div />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,106,31,0.06)_0%,rgba(176,54,255,0.06)_32%,transparent_62%)] blur-3xl" />
            <motion.div
              className="relative"
              animate={{ y: [0, -12, 0], rotate: [0, 1.6, 0, -1.6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-[-16%] rounded-full bg-[radial-gradient(circle,rgba(255,106,31,0.24)_0%,rgba(255,62,132,0.18)_34%,rgba(136,31,255,0.12)_60%,transparent_78%)] blur-3xl" />
              <img
                src={logoImg}
                alt="Edit2Scale"
                className="relative mx-auto w-[clamp(12rem,24vw,19rem)] drop-shadow-[0_20px_60px_rgba(255,102,45,0.22)]"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3,
                },
              },
            }}
            className="pb-14 text-center md:pb-20"
          >
            <motion.div variants={fadeInUp}>
              <span className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.36em] text-white/40 backdrop-blur-md md:px-5 md:py-2 md:text-[10px]">
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                Premium editing mentorship
              </span>
            </motion.div>

            <motion.h1
              variants={scaleIn}
              className="mx-auto max-w-[15ch] text-center font-display text-[clamp(2.85rem,9vw,6.6rem)] leading-[0.86] tracking-tight"
            >
              <span className="block text-white opacity-90">Where Editors</span>
              <span className="mt-4 block bg-gradient-to-r from-[#ff5c00] via-[#ff8a00] to-[#9d00ff] bg-clip-text text-transparent filter drop-shadow-sm">
                Become Earners
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-10 max-w-[34rem] text-[0.88rem] leading-[1.8] text-white/46 md:mt-9 md:text-[0.98rem]"
            >
              <span className="block mt-1">
                A structured system for creative skill and real-world income.
              </span>
            </motion.p>

            {/* 4. CTA*/}
            <motion.div variants={fadeInUp} className="mt-11">
              <motion.button
                type="button"
                onClick={scrollToDetails}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:text-white md:px-8 md:py-4 md:text-[11px]"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <span className="relative">Scroll to explore</span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <ChevronDown className="h-4 w-4 text-primary" />
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section ref={heroRef} className="relative z-10 pb-20 pt-20 md:pt-28">
        <motion.div style={{ y: heroParallax, opacity: heroOpacity }}>
          <div className="container mx-auto px-6">
            <div className="grid gap-14 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
              {/* Left Column*/}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
                  },
                }}
                className="space-y-10"
              >
                <motion.div variants={slideInLeft} className="max-w-fit">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 backdrop-blur-md">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    The Elite Standard
                  </span>
                </motion.div>

                <motion.div variants={slideInLeft} className="max-w-fit">
                  <div className="inline-flex items-center gap-4 rounded-[2rem] border border-white/5 bg-white/[0.01] p-3.5 pr-7 backdrop-blur-sm transition-colors hover:bg-white/[0.03]">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
                      <img
                        src={logoImg}
                        alt="Edit2Scale"
                        className="relative h-[4.35rem] w-[4.35rem] rounded-2xl border border-white/10 bg-black/50 p-2 md:h-[5.25rem] md:w-[5.25rem]"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
                        Edit2Scale
                      </p>
                      <p className="font-display text-[1.7rem] leading-none text-white md:text-[2.05rem]">
                        Mentorship
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={slideInLeft} className="space-y-5">
                  <h1 className="font-display text-[clamp(3.15rem,9vw,7rem)] leading-[0.86] tracking-tight text-white">
                    Where Editors
                    <br />
                    <span className="bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                      Become Earners
                    </span>
                  </h1>
                  <p className="max-w-xl text-[0.95rem] leading-[1.8] text-white/46">
                    Stop guessing. Start executing. We provide the structured
                    system, templates, and high-ticket workflows needed to turn
                    creative passion into a scalable business.
                  </p>
                </motion.div>

                <motion.ul
                  variants={slideInLeft}
                  className="grid gap-3.5 sm:grid-cols-3"
                >
                  {checklist.map((item, idx) => (
                    <motion.li
                      key={item}
                      className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.01] p-[1.125rem] transition-all hover:bg-white/[0.03]"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-[0.82rem] font-medium leading-snug text-white/70">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  variants={slideInLeft}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  <Button
                    size="lg"
                    className="gradient-bg h-12 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_10px_30px_rgba(255,97,36,0.18)]"
                    onClick={() => navigate("/courses")}
                  >
                    Explore Courses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-white/10 bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 hover:bg-white/5"
                    onClick={() => navigate("/signup")}
                  >
                    Start Free
                  </Button>
                </motion.div>

                <motion.div
                  variants={slideInLeft}
                  className="grid grid-cols-3 gap-5 border-t border-white/5 pt-8"
                >
                  {trustBadges.map((badge, idx) => (
                    <div key={badge.label} className="space-y-1">
                      <div className="font-mono text-2xl font-medium text-white">
                        <AnimatedCounter value={badge.value} />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
                        {badge.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={slideInRight}
                className="hero-frame mx-auto w-full max-w-[36rem] xl:ml-auto p-3.5 md:p-[1.125rem]"
              >
                <div className="relative z-10">
                  <span className="section-kicker">
                    Structured Learning System
                  </span>

                  <div className="mt-4 overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/30 shadow-[0_18px_42px_rgba(0,0,0,0.26)]">
                    <div className="group relative aspect-[4/3.95] overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=1350&fit=crop"
                        alt="Editing workspace"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                      <div className="absolute right-4 top-4 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-[0.54rem] font-bold uppercase tracking-[0.18em] text-white/72 backdrop-blur-sm md:right-5 md:top-5">
                        Built for creators who want skill + income
                      </div>
                      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-14 md:px-5 md:pb-5">
                        <p className="max-w-[21rem] font-display text-[2.15rem] leading-[0.94] tracking-[0.03em] text-white md:text-[3rem]">
                          Learn editing with a system that feels practical
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {searchTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[0.56rem] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 grid gap-2.5 md:grid-cols-3">
                    {heroHighlights.map((item, idx) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="rounded-[1.2rem] border border-[#A855F7]/10 bg-[#A855F7]/[0.025] p-3 backdrop-blur-sm transition-all duration-300 hover:border-[#A855F7]/22 hover:bg-[#A855F7]/[0.04] hover:shadow-[0_8px_24px_rgba(168,85,247,0.08)]"
                      >
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#A855F7]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-[0.72rem] leading-5 text-white/72">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE 1 ═══ */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ TESTIMONIALS SECTION ═══ */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="max-w-xl space-y-12"
            >
              <div className="space-y-6">
                <motion.div variants={premiumFadeIn}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 backdrop-blur-md">
                    <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    The Industry Standard
                  </span>
                </motion.div>

                <motion.h2
                  variants={premiumFadeIn}
                  className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] tracking-tight text-white"
                >
                  Curated by the <br />
                  <span className="bg-gradient-to-r from-[#ff5c00] via-[#ff8a00] to-[#9d00ff] bg-clip-text text-transparent">
                    Top Creators
                  </span>
                </motion.h2>

                <motion.p
                  variants={premiumFadeIn}
                  className="max-w-md text-[1rem] leading-relaxed text-white/40"
                >
                  Gain an unfair advantage with the exact assets, transitions,
                  and high-fidelity overlays used in viral productions.
                </motion.p>
              </div>

              <motion.div
                variants={premiumFadeIn}
                className="grid grid-cols-3 gap-8 border-y border-white/5 py-10"
              >
                {creatorStats.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <p className="font-mono text-3xl font-medium text-white">
                      <AnimatedCounter value={item.value} />
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      {item.label}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={premiumFadeIn}
                className="flex flex-wrap gap-2"
              >
                {searchTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/30 transition-all hover:border-primary/20 hover:text-white/60 hover:bg-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* ═══ FEATURED VISUAL FRAME ═══ */}
            <motion.div
              initial={{ opacity: 0, x: 40, filter: "blur(15px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:justify-self-end"
            >
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-primary/10 to-purple-500/10 blur-3xl opacity-50" />

              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-3 backdrop-blur-xl shadow-2xl"
              >
                <div className="group relative aspect-[16/10] overflow-hidden rounded-[2rem]">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                    poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop"
                  >
                    <source src={creatorPreviewVideoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-8 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      Preview Mentorship
                    </span>
                    <p className="text-lg font-medium text-white/90">
                      Inside the Creator Workflow
                    </p>
                    <p className="max-w-xs text-sm text-white/40 leading-relaxed">
                      Step-by-step breakdown of high-retention editing
                      techniques.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 md:py-24">
        <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="max-w-[35rem] space-y-6"
          >
            <div className="space-y-4">
              <span className="section-kicker">What students say</span>
              <h2 className="section-title max-w-3xl text-[clamp(2.8rem,7vw,4.8rem)]">
                Honest feedback from editors growing with
                <span className="mt-2 block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                  EDIT2SCALE
                </span>
              </h2>
              <p className="body-text max-w-xl">
                A cleaner testimonial layout that feels trustworthy and polished
                without trying too hard.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="w-full lg:justify-self-end"
          >
            <div className="glass-card-strong rounded-[1.9rem] p-5 md:p-7">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/18 bg-primary/8 text-primary">
                    <Quote className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-white/42">
                      People's review
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-primary">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className="h-3.5 w-3.5 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-white/52">
                  4.9 average rating
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="pt-5"
                >
                  <p className="text-[0.98rem] leading-[1.9] text-white/78 md:text-[1.04rem] italic">
                    {testimonialsText[currentTestimonial].text}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/62">
                      {courses[currentTestimonial % courses.length].title}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/62">
                      {testimonialsText[currentTestimonial].role}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-display text-2xl text-white">
                        {testimonialsText[currentTestimonial].name[0]}
                      </div>
                      <div>
                        <p className="text-[0.9rem] font-semibold text-white">
                          {testimonialsText[currentTestimonial].name}
                        </p>
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/42">
                          {testimonialsText[currentTestimonial].role}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={prevTestimonial}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition-all duration-300 hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={nextTestimonial}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition-all duration-300 hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex gap-2">
                {testimonialsText.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      idx === currentTestimonial
                        ? "w-8 bg-primary"
                        : "w-3 bg-white/20 hover:bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ MARQUEE 2 ═══ */}
      <div className="marquee-strip">
        <div className="marquee-track marquee-track-reverse">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`reverse-${item}-${index}`} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ COURSES SECTION ═══ */}
      <section className="relative z-10 py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div className="space-y-4">
              <span className="section-kicker">Learn and Grow</span>
              <h2 className="section-title max-w-3xl text-[clamp(2.65rem,7vw,4.8rem)]">
                Check out our
                <br />
                <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                  newest courses
                </span>
              </h2>
            </div>
            <p className="max-w-md text-[0.84rem] leading-[1.75] text-muted-foreground md:text-[0.92rem]">
              Explore the exact systems inside Edit2Scale for editing, motion
              and client growth.
            </p>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="shine-card course-card-hover glass-card-strong group mx-auto w-full max-w-[21.75rem] overflow-hidden rounded-[1.8rem] lg:max-w-none"
              >
                <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
                    Premium Course
                  </div>
                </div>

                <div className="space-y-4 p-5 md:p-6">
                  <div>
                    <h3 className="text-[1.7rem] tracking-[0.02em] text-white md:text-[2rem]">
                      {course.title}
                    </h3>
                    <p className="mt-2.5 text-[0.79rem] leading-[1.7] text-muted-foreground md:text-[0.82rem]">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/38 line-through">
                        {course.originalPrice}
                      </p>
                      <p className="gradient-text font-display text-[2.5rem] tracking-[0.05em] md:text-[3rem]">
                        {course.price}
                      </p>
                    </div>

                    <Button
                      className="gradient-bg glow-button h-11 shrink-0 rounded-full border-transparent px-5 text-[0.72rem] font-bold tracking-[0.08em] md:h-12 md:px-6 md:text-[0.76rem]"
                      onClick={() => navigate("/courses")}
                    >
                      Buy Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BUNDLE CTA ═══ */}
      <section className="relative z-10 pb-8 pt-6 md:pb-14">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hero-frame overflow-hidden p-6 md:p-10"
          >
            <div className="relative z-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
              <motion.div
                className="space-y-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="section-kicker">Complete Bundle</span>
                <h2 className="section-title max-w-4xl text-[clamp(3rem,8vw,6rem)]">
                  All 3 Courses
                  <br />
                  for just{" "}
                  <span className=" bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                    Rs. 4,499
                  </span>
                </h2>
                <p className="max-w-2xl text-[0.95rem] leading-[1.8] text-muted-foreground md:text-[1.02rem]">
                  Get lifetime access to all courses, one price and unlimited
                  growth. No hidden fees, no expiration.
                </p>
              </motion.div>

              <motion.div
                className="glass-card rounded-[1.8rem] p-5 md:p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-3.5">
                  {checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-[0.88rem] leading-[1.8] text-white/75"
                    >
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="gradient-bg glow-button mt-6 w-full border-transparent text-[0.85rem] font-bold tracking-wide"
                  onClick={() => navigate("/signup")}
                >
                  Get the Bundle
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ═══ FAQ SECTION ═══ */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="aurora-bg" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="section-kicker">Got Questions?</span>
            <h2 className="section-title mx-auto mt-5 max-w-3xl text-[clamp(3rem,8vw,5.4rem)]">
              Frequently Asked{" "}
              <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-muted-foreground md:text-[1.02rem]">
              Everything you need to know about Edit2Scale courses, access, and
              support.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqItems.map((item, index) => (
              <FAQItem key={index} item={item} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-[0.85rem] text-white/50">
              Still have questions?{" "}
              <motion.button
                type="button"
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-1.5 text-[#A855F7] transition-colors hover:text-[#D946EF] font-semibold"
                whileHover={{ x: 2 }}
              >
                Contact Us <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
