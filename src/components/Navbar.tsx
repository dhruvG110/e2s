import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Menu, X, LogOut, Shield } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold gradient-text">LearnPro</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
          {user && <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>}
          {isAdmin && (
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/signin")}>Sign In</Button>
              <Button size="sm" className="gradient-bg glow-button" onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden flex flex-col gap-3">
          <Link to="/courses" className="text-sm py-2" onClick={() => setMobileOpen(false)}>Courses</Link>
          {user && <Link to="/dashboard" className="text-sm py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
          {isAdmin && <Link to="/admin" className="text-sm py-2" onClick={() => setMobileOpen(false)}>Admin</Link>}
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => { navigate("/signin"); setMobileOpen(false); }}>Sign In</Button>
              <Button size="sm" className="gradient-bg" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Sign Up</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
