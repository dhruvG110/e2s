import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="cinematic-bg" />

      <div className="relative z-10 pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-black gradient-text">
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Questions, collaborations, or support — reach us anytime.
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg"
          >
            <p>
              <span className="gradient-text">Edit2Scale</span> is built for editors and creators who want <span className="gradient-text">clarity,
              direction <span className="text-white">and </span>real growth</span>. If you have questions about our
              courses, platform, or future plans, feel free to contact us.
            </p>

            <p>
              For partnerships, collaborations, or business inquiries, we’re
              always open to meaningful conversations that align with our
              mission.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 pt-4">
              <p>
                <span className="text-foreground font-medium">Email:</span>{" "}
                <span className="gradient-text">
                  edit2scalecontact@gmail.com
                </span>
              </p>

              <p>
                <span className="text-foreground font-medium">
                  WhatsApp / Call:
                </span>{" "}
                <span className="gradient-text">
                  +91 XXXXXXXXXX
                </span>
              </p>

              <p>
                <span className="text-foreground font-medium">
                  Instagram:
                </span>{" "}
                <span className="gradient-text">
                  @edit2scale
                </span>
              </p>
            </div>

            <p className="text-sm pt-6">
              We usually respond within 48 hours on business days.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}