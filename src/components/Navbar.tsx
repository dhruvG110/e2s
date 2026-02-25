import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import logoText from "@/assets/logo_txt_1.png";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* MAIN BAR */}
      <div className="container mx-auto grid grid-cols-3 h-16 items-center px-4">
        
        {/* LEFT: Mobile menu + Desktop links */}
        <div className="flex items-center gap-6 justify-start">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/courses"
              className="text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </Link>

            <Link
              to="/contact"
              className="text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* CENTER: Logo (perfectly centered) */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img
              src={logoText}
              alt="Edit2Scale"
              className="h-8 object-contain"
            />
          </Link>
        </div>

        {/* RIGHT: Auth buttons */}
        <div className="hidden md:flex items-center gap-3 justify-end">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 rounded-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/signin")}
                className="rounded-full"
              >
                Log In
              </Button>
              <Button
                size="sm"
                className="gradient-bg glow-button rounded-full px-6"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-3">
          <Link
            to="/courses"
            className="text-sm py-2"
            onClick={() => setMobileOpen(false)}
          >
            Courses
          </Link>

          <Link
            to="/contact"
            className="text-sm py-2"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="text-sm py-2"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleSignOut();
                setMobileOpen(false);
              }}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/signin");
                  setMobileOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="gradient-bg glow-button"
                onClick={() => {
                  navigate("/signup");
                  setMobileOpen(false);
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}