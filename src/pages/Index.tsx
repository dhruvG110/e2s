import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedGradientBg from "@/components/AnimatedGradientBg";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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
      "Professional video editing, transitions, effects & color grading",
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
    originalPrice: "₹4999",
    price: "₹1,999",
  },
  {
    title: "How to Find Clients and Scale",
    description:
      "Client acquisition strategies, pricing & scaling your editing services",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    originalPrice: "₹9999",
    price: "₹3,999",
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    
<div className="relative z-10 min-h-screen overflow-x-hidden overflow-y-auto bg-background">
      
      <div className="particles-bg pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className={`particle ${i % 6 === 0 ? "big" : "small"} ${
              i % 4 === 0 ? "square" : "circle"
            } ${i % 2 === 0 ? "orange" : "purple"}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * -20}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Check out our{" "}
              <span className="gradient-text">newest courses</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
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

                <div className="border-t border-border/30 p-4">
                  <Button
                    className="w-full rounded-full gradient-bg glow-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/courses");
                    }}
                  >
                    Buy Now
                  </Button>
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
