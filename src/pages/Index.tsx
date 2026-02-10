import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
const courses = [{
  title: "Alight Motion Course Mastery",
  description: "Master professional motion graphics and animation techniques using Alight Motion. From basics to advanced effects.",
  image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop"
}, {
  title: "CapCut Pro Editing",
  description: "Learn professional video editing with CapCut. Create viral-worthy content with transitions, effects, and color grading.",
  image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop"
}, {
  title: "How to Find Clients and Scale",
  description: "Build a thriving freelance business. Learn client acquisition strategies, pricing, and scaling your editing services.",
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
}];
const testimonials = [{
  name: "Rahul Sharma",
  role: "Freelance Video Editor",
  text: "Edit2Scale completely transformed my editing career. I went from struggling to find clients to having a waitlist within 3 months!",
  rating: 5
}, {
  name: "Priya Patel",
  role: "Content Creator",
  text: "The Alight Motion course is insanely detailed. I learned techniques that took my reels from 100 views to 100K+ views.",
  rating: 5
}, {
  name: "Arjun Mehta",
  role: "Agency Owner",
  text: "The client acquisition module alone was worth 10x the price. I scaled my agency to 6 figures using these exact strategies.",
  rating: 5
}, {
  name: "Sneha Reddy",
  role: "YouTube Editor",
  text: "CapCut Pro Editing course gave me the skills to land high-paying YouTube editing gigs. Best investment I've ever made.",
  rating: 5
}];
export default function Index() {
  const navigate = useNavigate();
  return <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-16">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-[120px] animate-glow-pulse" style={{
        animationDelay: "1.5s"
      }} />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7
        }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary my-[0.25px] mt-[2px]">
              <Sparkles className="h-4 w-4" /> Premium Editing Academy
            </div>

            {/* Video Embed */}
            <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl border border-border/50 glow-card">
              <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                <iframe className="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Edit2Scale Introduction" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Where Editors{" "}
              <span className="gradient-text">Become Earners</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Learn Alight Motion, CapCut Pro, and client acquisition strategies. Everything you need to become a successful video editor and scale your freelance business.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="gradient-bg glow-button text-lg px-8" onClick={() => navigate("/signup")}>
                Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-border hover:border-primary/50" onClick={() => navigate("/courses")}>
                Browse Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bundle Pricing */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-primary/5 p-8 glow-card">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">Complete Bundle</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              All 3 Courses for just{" "}
              <span className="gradient-text">₹2,199</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get lifetime access to Alight Motion Mastery, CapCut Pro Editing, and Client Scaling — one price, unlimited growth.
            </p>
            <Button size="lg" className="gradient-bg glow-button text-lg px-10 mt-6" onClick={() => navigate("/signup")}>
              Get the Bundle <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Check Out Our <span className="gradient-text">Newest Courses</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Everything you need to master editing and build a business</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => <motion.div key={course.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }} className="group glow-card rounded-2xl border border-border/50 bg-card/80 overflow-hidden cursor-pointer" onClick={() => navigate("/courses")}>
                <div className="aspect-video overflow-hidden">
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">{course.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="gradient-text font-bold text-lg">₹2,199</span>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">Bundle Deal</span>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              What Our <span className="gradient-text">Students Say</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Real results from real people</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {testimonials.map((t, i) => <motion.div key={t.name} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }} className="glow-card rounded-2xl border border-border/50 bg-card/80 p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-3" />
                <p className="text-muted-foreground leading-relaxed">{t.text}</p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({
                length: t.rating
              }).map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
}