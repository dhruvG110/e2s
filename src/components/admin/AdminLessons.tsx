import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminLessons() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [form, setForm] = useState({ title: "", mux_playback_id: "", course_id: "", order: 0, duration: 0 });

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
      let q = supabase.from("lessons").select("*, courses(title)").order("order");
      if (selectedCourse) q = q.eq("course_id", selectedCourse);
      const { data } = await q;
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
    onError: (e: any) => toast.error(e.message),
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

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="font-display text-xl font-semibold">Manage Lessons</h2>
        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48 bg-secondary"><SelectValue placeholder="All courses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All courses</SelectItem>
              {courses?.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={v => { if (!v) resetForm(); setOpen(v); }}>
            <DialogTrigger asChild>
              <Button className="gradient-bg glow-button gap-1.5"><Plus className="h-4 w-4" /> Add Lesson</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "New"} Lesson</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <div>
                  <Label>Course</Label>
                  <Select value={form.course_id} onValueChange={v => setForm(f => ({ ...f, course_id: v }))}>
                    <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>{courses?.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Title</Label><Input className="bg-secondary" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div><Label>MUX Playback ID</Label><Input className="bg-secondary" value={form.mux_playback_id} onChange={e => setForm(f => ({ ...f, mux_playback_id: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Order</Label><Input type="number" className="bg-secondary" value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} /></div>
                  <div><Label>Duration (min)</Label><Input type="number" className="bg-secondary" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} /></div>
                </div>
                <Button className="w-full gradient-bg" onClick={() => save.mutate()} disabled={save.isPending}>{editing ? "Update" : "Create"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {lessons?.map((l: any) => (
          <div key={l.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium shrink-0">{l.order}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{l.title}</h3>
              <p className="text-xs text-muted-foreground">{l.courses?.title} · {l.duration ?? 0}m</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setForm({ title: l.title, mux_playback_id: l.mux_playback_id ?? "", course_id: l.course_id, order: l.order, duration: l.duration ?? 0 }); setEditing(l.id); setOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => remove.mutate(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
