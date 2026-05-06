/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Tag, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formatCurrency = (value: number) => `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

export default function AdminSales() {
  const { data: purchases } = useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*, courses(title)")
        .order("created_at", { ascending: false });
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

  const totalRevenue = purchases?.reduce((sum, purchase) => sum + (purchase.amount_paid ?? 0), 0) ?? 0;
  const totalSales = purchases?.length ?? 0;
  const totalPromoUsage = promos?.reduce((sum, promo) => sum + (promo.usage_count ?? 0), 0) ?? 0;
  const averageOrder = totalSales > 0 ? totalRevenue / totalSales : 0;

  const stats = [
    { label: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
    { label: "Sales", value: totalSales.toString(), icon: ShoppingCart },
    { label: "Promo Uses", value: totalPromoUsage.toString(), icon: Tag },
    { label: "Avg Order", value: formatCurrency(averageOrder), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Sales Dashboard
        </p>
        <h2 className="mt-3 text-5xl text-white">Track Revenue</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="metric-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="metric-value gradient-text">{stat.value}</div>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card-strong rounded-[2rem] p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Recent Purchases
          </p>
          <h3 className="mt-3 text-4xl text-white">Latest Orders</h3>
        </div>

        <div className="mt-6 space-y-3">
          {purchases?.length ? (
            purchases.slice(0, 20).map((purchase: any) => (
              <div
                key={purchase.id}
                className="flex flex-col gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white md:text-base">
                    {purchase.courses?.title ?? "Unknown Course"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    <span>{new Date(purchase.created_at).toLocaleDateString()}</span>
                    {purchase.promo_code_used && <span>Promo: {purchase.promo_code_used}</span>}
                  </div>
                </div>

                <span className="font-display text-4xl gradient-text">
                  {formatCurrency(purchase.amount_paid ?? 0)}
                </span>
              </div>
            ))
          ) : (
            <div className="hero-frame p-8 text-center">
              <div className="relative z-10">
                <h4 className="text-5xl text-white">No Purchases Yet</h4>
                <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/45">
                  Sales data will appear here once orders are placed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
