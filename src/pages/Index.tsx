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
    title: "CapCut Pro Editing",
    description:
      "Professional video editing, transitions, effects & color grading",
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
    originalPrice: "₹4999",
    price: "₹1,999",
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
      "Client acquisition strategies, pricing & scaling your editing services",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    originalPrice: "₹9999",
    price: "₹3,999",
  },
];

const testimonials = [
  "/videos/testimonial1.mp4",
  "/videos/testimonial2.mp4",
  "/videos/testimonial3.mp4",
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

      {/* HERO */}

      <section className="relative min-h-screen pt-52 pb-20 z-10">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">

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

          <motion.h1
            className="text-4xl font-semibold leading-tight sm:text-6xl md:text-7xl gradient-text"
          >
            WHERE EDITORS
            <br />
            BECOME EARNERS
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pt-4"
          >
            <p className="mt-4 text-lg font-semibold text-muted-foreground">
              Become the top <span className="text-accent">1%</span> of video editors
            </p>

            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              A structured system designed to turn your editing skills into a real income
            </p>

            <ul className="mt-6 flex flex-col gap-3 text-left">
              {[
                "Master Alight Motion & CapCut like a pro",
                "Real project-based editing workflows",
                "Learn client acquisition & monetization",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CREATOR ASSET HUB */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-14 w-full max-w-md bg-card/80 backdrop-blur-md rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold">
             A Must watch for all video editors!
            </h2>

            <p className="gradient-text font-bold text-lg">
              From the creator 
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Access premium editing assets, transitions and overlays used by top creators
            </p>

          

            <div className="mt-5 aspect-video rounded-xl bg-secondary/30 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground text-left">
              Try these effects
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

      {/* VIDEO TESTIMONIAL SLIDER */}

      <section className="py-16">
        <div className="container mx-auto px-6 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-sm"
          >

            <div className="rounded-2xl border border-border/50 bg-card/80 p-3">

              <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-border/30">

                <video
                  src={testimonials[currentTestimonial]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={prevTestimonial}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={nextTestimonial}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
                >
                  <ChevronRight />
                </button>

              </div>
            </div>

            <p className="mt-8 text-sm text-accent flex items-center justify-center gap-2">
              
              See how creators are transforming their editing careers
            </p>

            <ArrowDown className="mx-auto mt-2 h-5 w-5 text-accent/50" />

         

          </motion.div>

        </div>
      </section>

      {/* COURSES */}

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

      <Footer />

    </div>
  );
}
