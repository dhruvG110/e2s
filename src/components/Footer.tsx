import { Instagram, Twitter, Youtube, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoText from "@/assets/logo_txt_1.png";

const footerLinks = [
  { name: "All Courses", path: "/courses" },
  { name: "Contact Us", path: "/contact" },
  { name: "Sign In", path: "/signin" },
  { name: "Sign Up", path: "/signup" },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/edit2scale",
    label: "Instagram",
  },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const footerTicker = Array.from({ length: 3 }).flatMap(() => [
  "Where Editors Become Earners",
  "Learn Alight Motion",
  "Master CapCut Pro Editing",
  "Scale Your Business",
]);

const staggerItem: any = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/8 bg-black/20">
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...footerTicker, ...footerTicker].map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-14 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.8fr]"
        >
          <motion.div variants={staggerItem} className="space-y-5">
            <img
              src={logoText}
              alt="Edit2Scale"
              className="h-11 object-contain"
            />
            <p className="max-w-md text-[0.85rem] leading-[1.85] text-muted-foreground">
              Premium online courses designed to turn hobbyists into
              professional editors. High-speed growth for your creative career.
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
          >
            {footerLinks.map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + idx * 0.05, duration: 0.35 }}
              >
                <Link
                  to={link.path}
                  className="block rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/68 transition-all duration-300 hover:border-white/14 hover:bg-white/[0.05] hover:text-white hover:translate-x-1"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <p className="section-kicker">Connect</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http") ? "noreferrer" : undefined
                  }
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/65 transition-all duration-300 hover:border-primary/35 hover:bg-primary/[0.06] hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-6 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/38 md:flex-row md:items-center md:justify-between"
        >
          <p className="flex items-center gap-1.5">
            Copyright {new Date().getFullYear()} Edit2Scale
            <Heart className="h-3 w-3 text-primary/60 inline" />
          </p>
          <p className="text-white/48">Creative Mastery Online</p>
        </motion.div>
      </div>
    </footer>
  );
}
