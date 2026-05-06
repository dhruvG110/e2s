import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MuxPlayer from "@mux/mux-player-react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  LayoutPanelLeft,
  Menu,
  PlayCircle,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("id", id!).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
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
      const lessonIds = lessons?.map((lesson) => lesson.id) ?? [];
      if (lessonIds.length === 0) return [];

      const { data } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);

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

      await supabase.from("course_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress", id] }),
  });

  if (!user) return <Navigate to="/signin" />;

  if (courseLoading || lessonsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="glass-card-strong rounded-[2rem] px-8 py-10 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Loading Course Player
          </p>
        </div>
      </div>
    );
  }

  if (!course || !lessons) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-24 text-muted-foreground">
        Course not found.
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background pt-24">
        <div className="cinematic-bg" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="hero-frame p-8 text-center md:p-12">
            <div className="relative z-10">
              <p className="section-kicker mx-auto w-fit">Course Player</p>
              <h1 className="mt-6 text-5xl text-white md:text-6xl">{course.title}</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                This course does not have any lessons yet. Check back soon after new content is published.
              </p>
              <Button
                variant="outline"
                className="mt-8 border-white/10 bg-white/[0.03]"
                onClick={() => navigate(`/courses/${id}`)}
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Course
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];
  const activeIndex = lessons.findIndex((lesson) => lesson.id === activeLesson?.id);
  const completedIds = new Set(progress?.filter((item) => item.completed).map((item) => item.lesson_id));
  const completionPercent = lessons.length > 0 ? (completedIds.size / lessons.length) * 100 : 0;

  const goPrev = () => {
    if (activeIndex > 0) setActiveLessonId(lessons[activeIndex - 1].id);
  };

  const goNext = () => {
    if (activeIndex < lessons.length - 1) setActiveLessonId(lessons[activeIndex + 1].id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pt-24">
      <div className="cinematic-bg" />

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close lesson sidebar"
        />
      )}

      <div className="relative z-40 mx-auto flex max-w-[1600px] gap-6 px-4 pb-8 md:px-6">
        <aside
          className={cn(
            "glass-card fixed inset-y-24 left-4 z-40 w-[320px] rounded-[2rem] p-4 transition-transform duration-300 md:left-6 lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-[115%]",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/8 pb-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    Course Player
                  </p>
                  <h2 className="mt-2 line-clamp-2 text-4xl text-white">{course.title}</h2>
                </div>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  <span>
                    {completedIds.size}/{lessons.length} Completed
                  </span>
                  <span>{Math.round(completionPercent)}%</span>
                </div>
                <Progress value={completionPercent} />
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
              {lessons.map((lesson, index) => {
                const isActive = activeLesson?.id === lesson.id;
                const isComplete = completedIds.has(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                      isActive
                        ? "border-primary/35 bg-primary/10 text-white"
                        : "border-white/8 bg-white/[0.02] text-white/65 hover:border-white/14 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isComplete ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-white/35" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                          Lesson {index + 1}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-current">
                          {lesson.title}
                        </p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                          {lesson.duration ?? 0} Min
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 lg:pl-2">
          <div className="space-y-6">
            <div className="hero-frame p-5 md:p-7">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSidebarOpen((open) => !open)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70"
                    >
                      {sidebarOpen ? <X className="h-4 w-4 lg:hidden" /> : <Menu className="h-4 w-4 lg:hidden" />}
                      <LayoutPanelLeft className="hidden h-4 w-4 lg:block" />
                    </button>

                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/[0.03]"
                      onClick={() => navigate(`/courses/${id}`)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Course
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    {completedIds.size}/{lessons.length} Lessons Completed
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-black">
                  <div className="aspect-video w-full">
                    {activeLesson?.mux_playback_id ? (
                      <MuxPlayer
                        playbackId={activeLesson.mux_playback_id}
                        streamType="on-demand"
                        accentColor="#ff6124"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/45">
                        No video available for this lesson
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                      Lesson {activeIndex + 1} of {lessons.length}
                    </p>
                    <h1 className="mt-3 text-5xl text-white md:text-6xl">{activeLesson?.title}</h1>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                      Keep moving through the course and mark each lesson complete as you finish it.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 xl:justify-end">
                    {activeIndex > 0 && (
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/[0.03]"
                        onClick={goPrev}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    )}

                    {!completedIds.has(activeLesson.id) && (
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/[0.03]"
                        onClick={() => markComplete.mutate(activeLesson.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Complete
                      </Button>
                    )}

                    {activeIndex < lessons.length - 1 && (
                      <Button className="gradient-bg glow-button border-transparent" onClick={goNext}>
                        Next Lesson
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Progress", value: `${Math.round(completionPercent)}%`, icon: CheckCircle },
                { label: "Current Lesson", value: `${activeIndex + 1}`, icon: PlayCircle },
                { label: "Duration", value: `${activeLesson?.duration ?? 0} Min`, icon: Clock },
              ].map((item) => (
                <div key={item.label} className="metric-card">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="metric-value gradient-text">{item.value}</div>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
