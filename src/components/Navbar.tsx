import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logoText from "@/assets/logo_txt_1.png";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const updateScrolled = () => {
      const nextScrolled = window.scrollY > 24;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      rafId = 0;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "Courses", path: "/courses" },
    { name: "Contact Us", path: "/contact" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
            scrolled
              ? "border-white/14 bg-[rgba(18,13,11,0.55)] shadow-[0_26px_80px_rgba(0,0,0,0.46)]"
              : "border-white/8 bg-[rgba(18,13,11,0.9)] shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
          }`}
          style={{
            backdropFilter: scrolled
              ? "blur(22px) saturate(1.35)"
              : "blur(0px)",
            WebkitBackdropFilter: scrolled
              ? "blur(22px) saturate(1.35)"
              : "blur(0px)",
          }}
          layout
        >
          <div className="grid h-[74px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:h-[78px] md:px-6">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white lg:hidden transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className={`relative rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${
                        isActive(link.path)
                          ? "bg-white/[0.07] text-white"
                          : "text-white/58 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {link.name}
                      {isActive(link.path) && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full border border-primary/20 bg-primary/[0.06]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 28,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Link to="/" className="inline-flex items-center justify-center">
                <motion.img
                  src={logoText}
                  alt="Edit2Scale"
                  className="h-10 object-contain md:h-[2.9rem]"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                />
              </Link>
            </div>

            <div className="flex items-center justify-end gap-2">
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="hidden md:inline-flex gap-2 border border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06] transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="hidden md:flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/signin")}
                    className="border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06] transition-all duration-300"
                  >
                    Log In
                  </Button>
                  <Button
                    size="sm"
                    className="gradient-bg glow-button border-transparent gap-1.5"
                    onClick={() => navigate("/signup")}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Sign Up
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-white/8 lg:hidden"
              >
                <motion.div
                  className="space-y-2 px-4 py-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: {
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }}
                    >
                      <Link
                        to={link.path}
                        className={`block rounded-2xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
                          isActive(link.path)
                            ? "bg-white/[0.07] text-white border border-primary/15"
                            : "bg-transparent text-white/65 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="grid gap-2 pt-2">
                    {user ? (
                      <Button
                        variant="ghost"
                        className="justify-center border border-white/10 bg-white/[0.03]"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="border-white/10 bg-white/[0.03]"
                          onClick={() => navigate("/signin")}
                        >
                          Log In
                        </Button>
                        <Button
                          className="gradient-bg glow-button border-transparent"
                          onClick={() => navigate("/signup")}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Sign Up
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );
}
