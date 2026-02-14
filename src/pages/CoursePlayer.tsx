import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { CheckCircle, Circle, ChevronRight, ChevronLeft, Menu, X } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("id", id!).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  const { data: lessons } = useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*").eq("course_id", id!).order("order");
      return data ?? [];
    },
    enabled: !!id,
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", id, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const lessonIds = lessons?.map(l => l.id) ?? [];
      if (lessonIds.length === 0) return [];
      const { data } = await supabase.from("course_progress").select("*").eq("user_id", user.id).in("lesson_id", lessonIds);
      return data ?? [];
    },
    enabled: !!user && !!lessons && lessons.length > 0,
  });

  useEffect(() => {
    if (lessons && lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const markComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) return;
      await supabase.from("course_progress").upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress", id] }),
  });

  const activeLesson = lessons?.find(l => l.id === activeLessonId);
  const activeIndex = lessons?.findIndex(l => l.id === activeLessonId) ?? 0;
  const completedIds = new Set(progress?.filter(p => p.completed).map(p => p.lesson_id));
  const completionPercent = lessons && lessons.length > 0 ? (completedIds.size / lessons.length) * 100 : 0;

  const goNext = () => {
    if (lessons && activeIndex < lessons.length - 1) {
      setActiveLessonId(lessons[activeIndex + 1].id);
    }
  };

  if (!course || !lessons) {
    return <div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 border-r border-border bg-card pt-16 transition-transform duration-300 lg:relative lg:translate-x-0 lg:pt-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-4">
            <h2 className="font-display font-semibold line-clamp-1">{course.title}</h2>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{completedIds.size}/{lessons.length} completed</span>
                <span>{Math.round(completionPercent)}%</span>
              </div>
              <Progress value={completionPercent} className="h-2" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => { setActiveLessonId(lesson.id); setSidebarOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm transition-colors",
                  activeLessonId === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {completedIds.has(lesson.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0" />
                )}
                <span className="flex-1 line-clamp-1">{i + 1}. {lesson.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-muted-foreground">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/${id}`)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Course
            </Button>
          </div>

          {activeLesson && (
            <>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black mb-6">
                {activeLesson.mux_playback_id ? (
                  <MuxPlayer
                    playbackId={activeLesson.mux_playback_id}
                    streamType="on-demand"
                    style={{ width: "100%", height: "100%" }}
                    accentColor="hsl(270 80% 65%)"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    No video available for this lesson
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold">{activeLesson.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">Lesson {activeIndex + 1} of {lessons.length}</p>
                </div>
                <div className="flex gap-2">
                  {!completedIds.has(activeLesson.id) && (
                    <Button variant="outline" onClick={() => markComplete.mutate(activeLesson.id)}>
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Mark Complete
                    </Button>
                  )}
                  {activeIndex < lessons.length - 1 && (
                    <Button className="gradient-bg glow-button" onClick={goNext}>
                      Next Lesson <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
