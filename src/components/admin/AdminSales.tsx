import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Tag, TrendingUp } from "lucide-react";

export default function AdminSales() {
  const { data: purchases } = useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const { data } = await supabase.from("purchases").select("*, courses(title)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: promos } = useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data } = await supabase.from("promo_codes").select("*");
      return data ?? [];
    },
  });

  const totalRevenue = purchases?.reduce((a, p) => a + p.amount_paid, 0) ?? 0;
  const totalSales = purchases?.length ?? 0;
  const totalPromoUsage = promos?.reduce((a, p) => a + p.usage_count, 0) ?? 0;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Total Sales", value: totalSales.toString(), icon: ShoppingCart },
    { label: "Promo Uses", value: totalPromoUsage.toString(), icon: Tag },
    { label: "Avg Order", value: `₹${totalSales > 0 ? Math.round(totalRevenue / totalSales).toLocaleString() : 0}`, icon: TrendingUp },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Sales Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="font-display font-semibold mb-4">Recent Purchases</h3>
      <div className="space-y-2">
        {purchases?.slice(0, 20).map((p: any) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <p className="font-medium">{p.courses?.title ?? "Unknown course"}</p>
              <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()} {p.promo_code_used && `· Promo: ${p.promo_code_used}`}</p>
            </div>
            <span className="font-display font-semibold gradient-text">₹{p.amount_paid}</span>
          </div>
        ))}
        {purchases?.length === 0 && <p className="text-center text-muted-foreground py-8">No purchases yet.</p>}
      </div>
    </div>
  );
}
