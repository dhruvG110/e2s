import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminLessons from "@/components/admin/AdminLessons";
import AdminPromos from "@/components/admin/AdminPromos";
import AdminSales from "@/components/admin/AdminSales";
import { BookOpen, ListVideo, Tag, BarChart3 } from "lucide-react";

export default function Admin() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl font-bold mb-8">
          Admin <span className="gradient-text">Panel</span>
        </h1>

        <Tabs defaultValue="courses">
          <TabsList className="bg-secondary mb-6">
            <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="h-4 w-4" /> Courses</TabsTrigger>
            <TabsTrigger value="lessons" className="gap-1.5"><ListVideo className="h-4 w-4" /> Lessons</TabsTrigger>
            <TabsTrigger value="promos" className="gap-1.5"><Tag className="h-4 w-4" /> Promos</TabsTrigger>
            <TabsTrigger value="sales" className="gap-1.5"><BarChart3 className="h-4 w-4" /> Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="courses"><AdminCourses /></TabsContent>
          <TabsContent value="lessons"><AdminLessons /></TabsContent>
          <TabsContent value="promos"><AdminPromos /></TabsContent>
          <TabsContent value="sales"><AdminSales /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
