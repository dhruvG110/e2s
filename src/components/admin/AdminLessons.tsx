/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLessons() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    mux_playback_id: "",
    course_id: "",
    order: 0,
    duration: 0,
  });

  const { data: courses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("title");
      return data ?? [];
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ["admin-lessons", selectedCourse],
    queryFn: async () => {
      let query = supabase.from("lessons").select("*, courses(title)").order("order");
      if (selectedCourse) query = query.eq("course_id", selectedCourse);
      const { data } = await query;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("lessons").update(form).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lessons").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success(editing ? "Lesson updated" : "Lesson created");
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Lesson deleted");
    },
  });

  const resetForm = () => {
    setForm({ title: "", mux_playback_id: "", course_id: "", order: 0, duration: 0 });
    setEditing(null);
    setOpen(false);
  };

  const editLesson = (lesson: any) => {
    setForm({
      title: lesson.title,
      mux_playback_id: lesson.mux_playback_id ?? "",
      course_id: lesson.course_id,
      order: lesson.order,
      duration: lesson.duration ?? 0,
    });
    setEditing(lesson.id);
    setOpen(true);
  };

  const totalDuration = lessons?.reduce((sum, lesson: any) => sum + (lesson.duration ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Lessons
            </p>
            <h2 className="mt-3 text-5xl text-white">Manage Lessons</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Visible", value: lessons?.length ?? 0 },
              { label: "Courses", value: courses?.length ?? 0 },
              { label: "Minutes", value: totalDuration },
            ].map((item) => (
              <div key={item.label} className="metric-card">
                <div className="metric-value gradient-text">{item.value}</div>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={selectedCourse || "all"} onValueChange={(value) => setSelectedCourse(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog
            open={open}
            onOpenChange={(value) => {
              if (!value) resetForm();
              setOpen(value);
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-bg glow-button border-transparent">
                <Plus className="h-4 w-4" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-4xl gradient-text-shimmer">
                  {editing ? "Edit Lesson" : "New Lesson"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Course</Label>
                  <Select value={form.course_id} onValueChange={(value) => setForm((current) => ({ ...current, course_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70">Title</Label>
                  <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70">MUX Playback ID</Label>
                  <Input
                    value={form.mux_playback_id}
                    onChange={(event) => setForm((current) => ({ ...current, mux_playback_id: event.target.value }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-white/70">Order</Label>
                    <Input
                      type="number"
                      value={form.order}
                      onChange={(event) => setForm((current) => ({ ...current, order: +event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/70">Duration (Min)</Label>
                    <Input
                      type="number"
                      value={form.duration}
                      onChange={(event) => setForm((current) => ({ ...current, duration: +event.target.value }))}
                    />
                  </div>
                </div>

                <Button
                  className="gradient-bg glow-button w-full border-transparent"
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                >
                  {editing ? "Update Lesson" : "Create Lesson"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {lessons?.length ? (
        <div className="grid gap-4">
          {lessons.map((lesson: any) => (
            <div
              key={lesson.id}
              className="glass-card-strong flex flex-col gap-4 rounded-[1.8rem] p-4 md:flex-row md:items-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/[0.04] font-display text-3xl text-white">
                {lesson.order}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-3xl text-white">{lesson.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  <span>{lesson.courses?.title ?? "No Course"}</span>
                  <span>{lesson.duration ?? 0} Min</span>
                  <span>{lesson.mux_playback_id ? "Video Ready" : "No Video"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="border-white/10 bg-white/[0.03]" onClick={() => editLesson(lesson)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/10 bg-white/[0.03]" onClick={() => remove.mutate(lesson.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hero-frame p-8 text-center">
          <div className="relative z-10">
            <h3 className="text-5xl text-white">No Lessons Yet</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/45">
              Add a lesson to start building course content
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
