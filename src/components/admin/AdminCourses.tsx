/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { TablesInsert } from "@/integrations/supabase/types";

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TablesInsert<"courses">>>({ title: "", description: "", price: 0, discount: 0, category: "", thumbnail_url: "", published: false });

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
    onError: (e: any) => toast.error(e.message),
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
    setForm({ title: "", description: "", price: 0, discount: 0, category: "", thumbnail_url: "", published: false });
    setEditing(null);
    setOpen(false);
  };

  const editCourse = (c: any) => {
    setForm({ title: c.title, description: c.description, price: c.price, discount: c.discount, category: c.category, thumbnail_url: c.thumbnail_url, published: c.published });
    setEditing(c.id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-semibold">Manage Courses</h2>
        <Dialog open={open} onOpenChange={v => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button className="gradient-bg glow-button gap-1.5"><Plus className="h-4 w-4" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "Edit" : "New"} Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <div><Label>Title</Label><Input className="bg-secondary" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea className="bg-secondary" value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price (₹)</Label><Input type="number" className="bg-secondary" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} /></div>
                <div><Label>Discount (%)</Label><Input type="number" className="bg-secondary" value={form.discount ?? 0} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} /></div>
              </div>
              <div><Label>Category</Label><Input className="bg-secondary" value={form.category ?? ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
              <div><Label>Thumbnail URL</Label><Input className="bg-secondary" value={form.thumbnail_url ?? ""} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.published ?? false} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} />
                <Label>Published</Label>
              </div>
              <Button className="w-full gradient-bg" onClick={() => save.mutate()} disabled={save.isPending}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {courses?.map(c => (
          <div key={c.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{c.title}</h3>
                {c.published && <span className="text-xs text-green-500">Published</span>}
              </div>
              <p className="text-sm text-muted-foreground">₹{c.price} | {c.discount ?? 0}% off | {c.category || "No category"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => editCourse(c)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => remove.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
