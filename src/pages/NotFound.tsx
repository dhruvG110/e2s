import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <div className="cinematic-bg" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb left-[-14%] top-[-18%] h-[520px] w-[520px] bg-primary/8" />
        <div
          className="floating-orb bottom-[-16%] right-[-14%] h-[460px] w-[460px] bg-[#7f1f10]/18"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="hero-frame relative z-10 w-full max-w-4xl p-8 text-center md:p-12"
      >
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="section-kicker mx-auto w-fit"
          >
            404 Error
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 120 }}
            className="mt-6 text-[clamp(7rem,20vw,14rem)] leading-none block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mt-3 text-5xl text-white md:text-6xl tracking-wide"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="mx-auto mt-4 max-w-xl text-[0.92rem] leading-[1.8] text-muted-foreground"
          >
            The page you are looking for does not exist or has been moved. Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="mt-8 flex justify-center gap-3"
          >
            <Link to="/">
              <Button size="lg" className="gradient-bg glow-button border-transparent text-[0.82rem] font-bold tracking-wide">
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/12 bg-white/[0.03] text-[0.82rem] font-bold tracking-wide hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
