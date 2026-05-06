import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  ListVideo,
  Tag,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminLessons from "@/components/admin/AdminLessons";
import AdminPromos from "@/components/admin/AdminPromos";
import AdminSales from "@/components/admin/AdminSales";
import AdminTestimonials from "@/components/admin/AdminTestimonials";

export default function Admin() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="glass-card-strong rounded-[2rem] px-8 py-10 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Loading Admin
          </p>
        </div>
      </div>
    );
  }

  // if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 pt-28">
      <div className="cinematic-bg" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-4"
        >
          <span className="section-kicker">Back Office</span>
          <h1 className="section-title max-w-4xl text-[clamp(3.6rem,10vw,6.2rem)]">
            Admin{" "}
            <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
              Panel
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Manage courses, lessons, promo systems and sales performance from
            one place.
          </p>
        </motion.div>

        <div className="signal-line my-10" />

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-[1.6rem] p-2">
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <ListVideo className="h-4 w-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="promos" className="gap-2">
              <Tag className="h-4 w-4" />
              Promos
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Testimonials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <AdminCourses />
          </TabsContent>
          <TabsContent value="lessons">
            <AdminLessons />
          </TabsContent>
          <TabsContent value="promos">
            <AdminPromos />
          </TabsContent>
          <TabsContent value="sales">
            <AdminSales />
          </TabsContent>
          <TabsContent value="testimonials">
            <AdminTestimonials />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
