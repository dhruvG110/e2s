import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import logoImg from "@/assets/logo_image.png";

const courses = [
  {
    title: "CapCut Pro Editing",
    description:
      "Professional video editing, transitions, effects & color grading",
    originalPrice: "₹4999",
    price: "₹1,999",
  },
  {
    title: "Alight Motion",
    description: "Motion graphics, transitions, VFX & real-world projects",
    originalPrice: "₹6999",
    price: "₹2,999",
  },
  {
    title: "How to Find Clients and Scale",
    description:
      "Client acquisition strategies, pricing & scaling your editing services",
    originalPrice: "₹9999",
    price: "₹3,999",
  },
];

const videoTestimonials = [
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
    setCurrentTestimonial((prev) => (prev + 1) % videoTestimonials.length);

  const prevTestimonial = () =>
    setCurrentTestimonial(
      (prev) => (prev - 1 + videoTestimonials.length) % videoTestimonials.length
    );

  return (
    <div className="relative z-10 min-h-screen overflow-x-hidden overflow-y-auto bg-background">

      <ParticleBackground />

      {/* HERO */}
      <section className="relative min-h-screen pt-52 pb-20 z-10">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <img
              src={logoImg}
              alt="Edit2Scale"
              className="h-[240px] w-[240px] mx-auto"
            />
          </motion.div>

          <motion.h1 className="text-4xl font-semibold leading-tight sm:text-6xl md:text-7xl gradient-text">
            WHERE EDITORS
            <br />
            BECOME EARNERS
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="pt-4"
          >
            <p className="mt-4 text-lg font-semibold text-muted-foreground">
              Become the top <span className="text-accent">1%</span> of editors
            </p>

            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              A system dedicated to turning editing into a real career.
            </p>

            <ul className="mt-6 flex flex-col gap-3 text-left">
              {[
                "Master Alight Motion & CapCut",
                "Real project based learning",
                "Learn client acquisition & monetization",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </section>

      {/* VIDEO TESTIMONIAL */}
      <section className="py-14">
        <div className="container mx-auto px-4 sm:px-6 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-[240px] sm:max-w-xs md:max-w-sm"
          >

            <div className="rounded-2xl border border-border/50 bg-card/80 p-2 sm:p-3">

              <div className="relative aspect-[9/16] max-h-[420px] sm:max-h-[460px] md:max-h-none rounded-xl overflow-hidden border border-border/30">

                <video
                  src={videoTestimonials[currentTestimonial]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={prevTestimonial}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-white/80"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={nextTestimonial}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-white/80"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

              </div>
            </div>

            <p className="mt-6 text-xs sm:text-sm text-accent flex items-center justify-center gap-2">
              <ArrowDown className="h-4 w-4" />
              See how creators are transforming their editing careers
            </p>

            <Button
              size="lg"
              className="mt-5 rounded-full gradient-bg glow-button text-base sm:text-lg px-8 sm:px-10"
              onClick={() => navigate("/signup")}
            >
              Buy Now
            </Button>

          </motion.div>

        </div>
      </section>

      {/* COURSES */}
      <section className="py-16">
        <div className="container mx-auto px-6">

          <h2 className="text-3xl font-bold md:text-4xl text-center mb-10">
            Check out our <span className="gradient-text">newest courses</span>
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.title}
                className="group shine-card rounded-2xl border border-border/50 bg-card/80 overflow-hidden cursor-pointer course-card-hover"
                onClick={() => navigate("/courses")}
              >
                <div className="p-5">

                  <h3 className="text-lg font-bold">{course.title}</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>

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

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">

          <div className="mx-auto max-w-2xl rounded-2xl border border-accent/30 bg-accent/5 p-8">

            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
              Complete Bundle
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              All 3 Courses for just{" "}
              <span className="gradient-text">₹4,499</span>
            </h2>

            <Button
              size="lg"
              className="gradient-bg glow-button text-lg px-10 mt-6 rounded-full"
              onClick={() => navigate("/signup")}
            >
              Get the Bundle <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
}
