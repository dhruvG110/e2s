import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { PlayCircle, Clock, Tag, CheckCircle } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("id", id!).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  const { data: lessons } = useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*").eq("course_id", id!).order("order");
      return data ?? [];
    },
    enabled: !!id,
  });

  const { data: purchased } = useQuery({
    queryKey: ["purchased", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.from("purchases").select("id").eq("user_id", user.id).eq("course_id", id!).maybeSingle();
      return !!data;
    },
    enabled: !!id && !!user,
  });

  if (!course) return <div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">Loading...</div>;

  const baseDiscount = course.discount ?? 0;
  const totalDiscount = Math.min(baseDiscount + discount, 100);
  const finalPrice = course.price * (1 - totalDiscount / 100);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    const res = await supabase.functions.invoke("apply-promo-code", {
      body: { code: promoCode.trim().toUpperCase() },
    });
    if (res.data?.valid) {
      setDiscount(res.data.discount_percent);
      setPromoApplied(true);
      toast.success(`Promo applied! ${res.data.discount_percent}% extra off`);
    } else {
      toast.error(res.data?.error || "Invalid or expired promo code");
    }
  };

  const handleBuy = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    try {
      const res = await supabase.functions.invoke("create-razorpay-order", {
        body: { courseId: id, amount: Math.round(finalPrice * 100), promoCode: promoApplied ? promoCode : undefined },
      });
      if (res.error) throw res.error;

      const { orderId, razorpayKeyId } = res.data;

      const options = {
        key: razorpayKeyId,
        amount: Math.round(finalPrice * 100),
        currency: "INR",
        name: "Edit2Scale",
        description: course.title,
        order_id: orderId,
        handler: async (response: any) => {
          const verifyRes = await supabase.functions.invoke("verify-razorpay-payment", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: id,
              amountPaid: finalPrice,
              promoCode: promoApplied ? promoCode : undefined,
            },
          });
          if (verifyRes.error) {
            toast.error("Payment verification failed");
          } else {
            toast.success("Purchase successful! Enjoy your course.");
            navigate(`/course/${id}/learn`);
          }
        },
        theme: { color: "#8b5cf6" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-secondary mb-6">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center gradient-bg opacity-30">
                  <PlayCircle className="h-16 w-16 text-primary-foreground/50" />
                </div>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">{course.title}</h1>
            {course.category && <Badge variant="secondary" className="mb-4">{course.category}</Badge>}
            <p className="text-muted-foreground leading-relaxed">{course.description}</p>

            {lessons && lessons.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold mb-4">Course Content</h2>
                <div className="space-y-2">
                  {lessons.map((lesson, i) => (
                    <div key={lesson.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium">{i + 1}</span>
                      <span className="flex-1 text-sm">{lesson.title}</span>
                      {lesson.duration && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {lesson.duration}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-24 border-border/50 bg-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold gradient-text">₹{finalPrice.toFixed(0)}</span>
                    {totalDiscount > 0 && (
                      <span className="text-lg text-muted-foreground line-through">₹{course.price.toFixed(0)}</span>
                    )}
                  </div>
                  {totalDiscount > 0 && (
                    <Badge className="mt-2 gradient-bg border-0">{totalDiscount}% OFF</Badge>
                  )}
                </div>

                {!purchased && (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1 glow-input rounded-lg">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Promo code"
                          className="pl-10 bg-secondary border-border uppercase"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                        />
                      </div>
                      <Button variant="outline" onClick={applyPromo} disabled={promoApplied}>
                        {promoApplied ? <CheckCircle className="h-4 w-4" /> : "Apply"}
                      </Button>
                    </div>
                  </div>
                )}

                {purchased ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 p-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Already Purchased</span>
                    </div>
                    <Button className="w-full gradient-bg glow-button" onClick={() => navigate(`/course/${id}/learn`)}>
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full gradient-bg glow-button" onClick={handleBuy}>
                    Buy Now
                  </Button>
                )}

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><PlayCircle className="h-4 w-4" /> {lessons?.length ?? 0} lessons</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {lessons?.reduce((a, l) => a + (l.duration ?? 0), 0)}m total</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
