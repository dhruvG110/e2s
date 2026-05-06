/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formatCurrency = (value: number) => `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TablesInsert<"courses">>>({
    title: "",
    description: "",
    price: 0,
    discount: 0,
    category: "",
    thumbnail_url: "",
    published: false,
  });

  const { data: courses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("courses").update(form).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(form as TablesInsert<"courses">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success(editing ? "Course updated" : "Course created");
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course deleted");
    },
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: 0,
      discount: 0,
      category: "",
      thumbnail_url: "",
      published: false,
    });
    setEditing(null);
    setOpen(false);
  };

  const editCourse = (course: any) => {
    setForm({
      title: course.title,
      description: course.description,
      price: course.price,
      discount: course.discount,
      category: course.category,
      thumbnail_url: course.thumbnail_url,
      published: course.published,
    });
    setEditing(course.id);
    setOpen(true);
  };

  const publishedCount = courses?.filter((course) => course.published).length ?? 0;
  const draftCount = (courses?.length ?? 0) - publishedCount;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Courses
            </p>
            <h2 className="mt-3 text-5xl text-white">Manage Courses</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total", value: courses?.length ?? 0 },
              { label: "Published", value: publishedCount },
              { label: "Drafts", value: draftCount },
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
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-4xl gradient-text-shimmer">
                {editing ? "Edit Course" : "New Course"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-white/70">Title</Label>
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-white/70">Description</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Price (Rs.)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: +event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Discount (%)</Label>
                <Input
                  type="number"
                  value={form.discount ?? 0}
                  onChange={(event) => setForm((current) => ({ ...current, discount: +event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Category</Label>
                <Input
                  value={form.category ?? ""}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Thumbnail URL</Label>
                <Input
                  value={form.thumbnail_url ?? ""}
                  onChange={(event) => setForm((current) => ({ ...current, thumbnail_url: event.target.value }))}
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">Published</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Toggle course visibility
                  </p>
                </div>
                <Switch
                  checked={form.published ?? false}
                  onCheckedChange={(value) => setForm((current) => ({ ...current, published: value }))}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  className="gradient-bg glow-button w-full border-transparent"
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                >
                  {editing ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {courses?.length ? (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-card-strong grid gap-4 rounded-[1.8rem] p-4 md:grid-cols-[180px_1fr_auto] md:items-center"
            >
              <div className="overflow-hidden rounded-[1.3rem] border border-white/8 bg-black/25">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="aspect-[16/10] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-white/25" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-3xl text-white">{course.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      course.published
                        ? "bg-primary/15 text-primary"
                        : "bg-white/[0.05] text-white/45"
                    }`}
                  >
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">
                  {course.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  <span>{formatCurrency(course.price)}</span>
                  <span>{course.discount ?? 0}% Off</span>
                  <span>{course.category || "No Category"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:flex-col">
                <Button variant="outline" size="icon" className="border-white/10 bg-white/[0.03]" onClick={() => editCourse(course)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/10 bg-white/[0.03]" onClick={() => remove.mutate(course.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hero-frame p-8 text-center">
          <div className="relative z-10">
            <h3 className="text-5xl text-white">No Courses Yet</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/45">
              Create your first course to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
