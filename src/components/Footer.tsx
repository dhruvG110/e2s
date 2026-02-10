import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold gradient-text">Edit2Scale</span>
            </div>
            <p className="text-sm text-muted-foreground">Premium online courses to accelerate your career.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/courses" className="hover:text-foreground transition-colors">All Courses</Link>
              <Link to="/signin" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Connect</h4>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">YouTube</a>
              <a href="#" className="hover:text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Edit2Scale. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
