/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminPromos() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_percent: 10,
    salesperson_name: "",
    is_active: true,
  });

  const { data: promos } = useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("promo_codes")
        .insert({ ...form, code: form.code.toUpperCase() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promos"] });
      toast.success("Promo code created");
      setForm({ code: "", discount_percent: 10, salesperson_name: "", is_active: true });
      setOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
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

  const activeCount = promos?.filter((promo) => promo.is_active).length ?? 0;
  const totalUsage = promos?.reduce((sum, promo) => sum + (promo.usage_count ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Promo Codes
            </p>
            <h2 className="mt-3 text-5xl text-white">Manage Promos</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total", value: promos?.length ?? 0 },
              { label: "Active", value: activeCount },
              { label: "Usage", value: totalUsage },
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg glow-button border-transparent">
              <Plus className="h-4 w-4" />
              New Promo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-4xl gradient-text-shimmer">Create Promo Code</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">Code</Label>
                <Input
                  className="uppercase"
                  value={form.code}
                  onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Discount %</Label>
                <Input
                  type="number"
                  value={form.discount_percent}
                  onChange={(event) => setForm((current) => ({ ...current, discount_percent: +event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Salesperson</Label>
                <Input
                  value={form.salesperson_name}
                  onChange={(event) => setForm((current) => ({ ...current, salesperson_name: event.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">Active</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Enable for checkout
                  </p>
                </div>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))}
                />
              </div>

              <Button
                className="gradient-bg glow-button w-full border-transparent"
                onClick={() => create.mutate()}
                disabled={create.isPending}
              >
                Create Promo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {promos?.length ? (
        <div className="grid gap-4">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="glass-card-strong flex flex-col gap-4 rounded-[1.8rem] p-4 md:flex-row md:items-center"
            >
              <div className="inline-flex rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 font-display text-3xl text-white">
                {promo.code}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      promo.is_active
                        ? "bg-primary/15 text-primary"
                        : "bg-white/[0.05] text-white/45"
                    }`}
                  >
                    {promo.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {promo.discount_percent}% Off
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  <span>{promo.salesperson_name || "No Salesperson"}</span>
                  <span>Used {promo.usage_count} Times</span>
                </div>
              </div>

              <Button variant="outline" size="icon" className="border-white/10 bg-white/[0.03]" onClick={() => remove.mutate(promo.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="hero-frame p-8 text-center">
          <div className="relative z-10">
            <h3 className="text-5xl text-white">No Promo Codes Yet</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/45">
              Create a promo code to start campaign tracking
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
