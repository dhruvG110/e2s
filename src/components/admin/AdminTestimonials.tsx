/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminTestimonials() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TablesInsert<"testimonials">>>({
    author_name: "",
    author_role: "",
    author_image: "",
    content: "",
    rating: 5,
    published: false,
  });

  const { data: testimonials } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase
          .from("testimonials")
          .update(form)
          .eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert(form as TablesInsert<"testimonials">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial deleted");
    },
  });

  const resetForm = () => {
    setForm({
      author_name: "",
      author_role: "",
      author_image: "",
      content: "",
      rating: 5,
      published: false,
    });
    setEditing(null);
    setOpen(false);
  };

  const handleEdit = (testimonial: any) => {
    setForm(testimonial);
    setEditing(testimonial.id);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="author_name">Author Name</Label>
                <Input
                  id="author_name"
                  value={form.author_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, author_name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="author_role">Author Role</Label>
                <Input
                  id="author_role"
                  value={form.author_role || ""}
                  onChange={(e) =>
                    setForm({ ...form, author_role: e.target.value })
                  }
                  placeholder="Student, Professional, etc."
                />
              </div>
              <div>
                <Label htmlFor="author_image">Author Image URL</Label>
                <Input
                  id="author_image"
                  value={form.author_image || ""}
                  onChange={(e) =>
                    setForm({ ...form, author_image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
              <div>
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea
                  id="content"
                  value={form.content || ""}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="Enter the testimonial text..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select
                  value={String(form.rating || 5)}
                  onValueChange={(val) =>
                    setForm({ ...form, rating: parseInt(val) })
                  }
                >
                  <SelectTrigger id="rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published || false}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.checked })
                  }
                  className="h-4 w-4 rounded"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Published
                </Label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => save.mutate()}
                  className="flex-1"
                  disabled={save.isPending}
                >
                  {save.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {testimonials?.map((testimonial: any) => (
          <div
            key={testimonial.id}
            className="glass-card rounded-lg p-4 flex items-start gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{testimonial.author_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.author_role}
                  </p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm">{testimonial.content}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`px-2 py-1 rounded ${testimonial.published ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {testimonial.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(testimonial)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove.mutate(testimonial.id)}
                disabled={remove.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
