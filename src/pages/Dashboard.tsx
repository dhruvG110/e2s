/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CourseCard from "@/components/CourseCard";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useAuth();

  const { data: purchases } = useQuery({
    queryKey: ["my-purchases", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*, courses(*)")
        .eq("user_id", user!.id)
        .gte("expires_at", new Date().toISOString());
      return data ?? [];
    },
    enabled: !!user,
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/signin" />;

  const purchasedCourses = purchases?.map(p => p.courses).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl font-bold mb-2">
          My <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mb-8">Your enrolled courses</p>

        {purchasedCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {purchasedCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg mb-2">You haven't enrolled in any courses yet.</p>
            <p>Browse our catalog to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
