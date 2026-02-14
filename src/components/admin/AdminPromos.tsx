/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminPromos() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount_percent: 10, salesperson_name: "", is_active: true });

  const { data: promos } = useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("promo_codes").insert({ ...form, code: form.code.toUpperCase() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promos"] });
      toast.success("Promo code created");
      setForm({ code: "", discount_percent: 10, salesperson_name: "", is_active: true });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promos"] });
      toast.success("Promo deleted");
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-semibold">Promo Codes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg glow-button gap-1.5"><Plus className="h-4 w-4" /> New Promo</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display">Create Promo Code</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <div><Label>Code</Label><Input className="bg-secondary uppercase" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} /></div>
              <div><Label>Discount %</Label><Input type="number" className="bg-secondary" value={form.discount_percent} onChange={e => setForm(f => ({ ...f, discount_percent: +e.target.value }))} /></div>
              <div><Label>Salesperson</Label><Input className="bg-secondary" value={form.salesperson_name} onChange={e => setForm(f => ({ ...f, salesperson_name: e.target.value }))} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
              <Button className="w-full gradient-bg" onClick={() => create.mutate()} disabled={create.isPending}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {promos?.map(p => (
          <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{p.code}</span>
                <span className={`text-xs ${p.is_active ? "text-green-500" : "text-red-400"}`}>{p.is_active ? "Active" : "Inactive"}</span>
              </div>
              <p className="text-sm text-muted-foreground">{p.discount_percent}% off · {p.salesperson_name || "No salesperson"} · Used {p.usage_count}x</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove.mutate(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
