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

const courses = [
  {
    title: "Aligt Motion",
    description: "Motion graphics, transitions, VFX & real-world projects",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
    originalPrice: "₹6999",
    price: "₹2,999",
  },
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
    title: "Alight Motion",
    description: "Motion graphics, transitions, VFX & real-world projects",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
    originalPrice: "₹6999",
    price: "₹2,999",
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

const testimonials = [
  {
    name: "Max Lu",
    role: "Content Creator · YouTube Educator",
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

const searchTags = [
  "Shake Effect",
  "Glow Effect",
  "Beat Sync",
  "Auto Captions",
];

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
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentTestimonial(
      (current) =>
        (current - 1 + testimonialsText.length) % testimonialsText.length,
    );

  const scrollToDetails = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    
<div className="relative z-10 min-h-screen overflow-x-hidden overflow-y-auto bg-background">
      
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
{/* 
      <br />
      <br />
      <br />
      <br /> */}
      {/* Hero — two-column layout matching reference */}
<section className="relative min-h-screen pt-52 pb-20 z-10">
  <div className="container mx-auto px-6 flex flex-col items-center text-center">

    {/* LOGO / ILLUSTRATION */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.45 }}
      className="mb-6"
    >
      <img
        src={logoImg}
        alt="Edit2Scale"
        className="h-[240px] w-[240px] mx-auto"
      />
    </motion.div>

    {/* HEADLINE */}
    <motion.h1
     
    
      className="text-4xl font-semibold leading-tight sm:text-6xl md:text-7xl gradient-text"
    >
      WHERE EDITORS
      <br />
      BECOME EARNERS
    </motion.h1>

    {/* SUBTEXT */}
    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1], }} className="pt-4">
      
    <p className="mt-4 text-lg font-semibold text-muted-foreground">
      Become the top <span className="text-accent">1%</span> of the kiln
    </p>

    <p className="mt-2 text-sm text-muted-foreground max-w-md">
      No random tutorials, No confusion, No wasted years
    </p>

    {/* CHECKLIST */}
    <ul className="mt-6 flex flex-col gap-3 text-left">
      {[
        "Master After Effects & CapCut",
        "Project-based learning",
        "Monetize your skills instantly",
      ].map((item) => (
        <li key={item} className="flex items-center gap-3">
          <Check className="h-5 w-5 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
</motion.div>
    {/* ASSET HUB CARD (ONLY BOX ALLOWED) */}
    <motion.div
     initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1, delay: 0.2 }}
  className="mt-14 w-full max-w-md bg-card/80 backdrop-blur-md rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold">
        Spice up your edits with the
      </h2>
      <p className="gradient-text font-bold text-lg">
        Creator Asset Hub
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Access a handpicked pool of vetted reusable assets from top creators
      </p>

      <Button
        size="sm"
        className="mt-4 rounded-full gradient-bg glow-button px-6"
      >
        <Search className="h-4 w-4 mr-1" />
        Search
      </Button>

      <div className="mt-5 aspect-video rounded-xl bg-secondary/30 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop"
          className="w-full h-full object-cover"
        />
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-left">
        Try these searches
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {searchTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary/40 px-3 py-1 text-xs cursor-pointer hover:bg-secondary/60 transition"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>

  </div>
</section>
      {/* Profile Preview + Buy Now */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-sm"
          >
            <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
              <div className="aspect-square rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Profile Preview
                </span>
              </div>
            </div>

            <p className="mt-8 text-sm text-accent flex items-center justify-center gap-2">
              <ArrowDown className="h-4 w-4" />
              Learn faster with curated creator profiles
            </p>
            <ArrowDown className="mx-auto mt-2 h-5 w-5 text-accent/50" />

            <Button
              size="lg"
              className="mt-6 rounded-full gradient-bg glow-button text-lg px-10"
              onClick={() => navigate("/signup")}
            >
              Buy Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Helping creators find the{" "}
              <span className="gradient-text">exact skills they need</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-lg"
          >
            <div className="rounded-2xl border border-border/50 bg-card/80 p-8">
              <p className="text-muted-foreground leading-relaxed text-sm">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-bg" />
                <div className="text-left">
                  <p className="font-semibold text-sm">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-x-6 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 translate-x-6 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16">
        <div className="container mx-auto px-6">
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
                transition={{ delay: i * 0.1 }}
               className="group shine-card rounded-2xl border border-border/50 bg-card/80 overflow-hidden cursor-pointer course-card-hover"

                onClick={() => navigate("/courses")}
              >
                <div className="p-5">
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="mt-4 aspect-video rounded-xl bg-secondary/30 border border-border/30 overflow-hidden flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">
                      Course image
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {course.originalPrice}
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {course.price}
                    </span>
                  </div>
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

      {/* Bundle CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-2xl border border-accent/30 bg-accent/5 p-8"
            style={{
              boxShadow:
                "0 0 40px hsl(25 95% 55% / 0.1), 0 0 80px hsl(270 80% 65% / 0.05)",
            }}
          >
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
              Complete Bundle
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              All 3 Courses for just{" "}
              <span className="gradient-text">₹4,499</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get lifetime access to all courses — one price, unlimited growth.
            </p>
            <Button
              size="lg"
              className="gradient-bg glow-button text-lg px-10 mt-6 rounded-full"
              onClick={() => navigate("/signup")}
            >
              Get the Bundle <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />

    </div>
  );
}


