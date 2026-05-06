import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Instagram,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import Footer from "@/components/Footer";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "edit2scalecontact@gmail.com",
    href: "mailto:edit2scalecontact@gmail.com",
    color: "from-orange-500/20 to-amber-500/10",
  },
  {
    icon: Phone,
    label: "WhatsApp / Call",
    value: "+91 XXXXXXXXXX",
    href: "#",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@edit2scale",
    href: "https://instagram.com/edit2scale",
    color: "from-pink-500/20 to-purple-500/10",
  },
];

const fadeInUp: any = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function Contact() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-12 pt-28">
      <div className="cinematic-bg" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb left-[-10%] top-[-12%] h-[420px] w-[420px] bg-primary/10" />
        <div
          className="floating-orb bottom-[-12%] right-[-8%] h-[360px] w-[360px] bg-[#7f1f10]/18"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="section-kicker">Get In Touch</span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="section-title mt-5 text-[clamp(3.6rem,10vw,6.2rem)]"
          >
            <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
              Contact Us
            </span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-muted-foreground md:text-[1.05rem]"
          >
            Questions, collaborations, or support — reach us anytime and we'll
            get back to you as soon as possible.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-4xl hero-frame p-6 md:p-8"
        >
          <div className="relative z-10 flex items-start gap-4">
            <div className="hidden md:flex mt-1 h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4 text-[0.9rem] leading-[1.85] text-white/75">
              <p>
                <span className="gradient-text font-semibold">Edit2Scale</span>{" "}
                is built for editors and creators who want clarity, direction
                and real growth. If you have questions about our courses,
                platform, or future plans — feel free to contact us.
              </p>
              <p>
                For partnerships, collaborations, or business inquiries, we are
                always open to meaningful conversations that align with our
                mission.
              </p>
            </div>
          </div>
        </motion.div>

     <div className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-3">
  {contactMethods.map((method, index) => (
    <motion.a
      key={method.label}
      href={method.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 + index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative block"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] blur-2xl" />
      
      <div className="relative h-full glass-card-strong rounded-[2rem] p-8 border border-white/5 group-hover:border-white/10 transition-all duration-500">
        {/* Icon Container */}
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${method.color} border border-white/5 transition-transform duration-500 group-hover:scale-110`}>
          <method.icon className="h-5 w-5 text-white" />
        </div>

        <div className="mt-10">
          {/* Refined Label: Smaller and More Spacing */}
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 mb-3">
            {method.label}
          </p>
          
          <div className="flex items-center justify-between gap-3">
            {/* The "Technical" Monospace Font for Values */}
            <h3 className="font-mono text-[0.95rem] md:text-base font-medium text-white/90 tracking-tight group-hover:text-primary transition-colors">
              {method.value}
            </h3>
            
            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/5 group-hover:border-primary/30 transition-all">
              <ArrowUpRight className="h-3.5 w-3.5 text-white/20 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  ))}
</div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/38"
        >
          We usually respond within 48 hours on business days
        </motion.p>
      </div>

      <Footer />
    </div>
  );
}
