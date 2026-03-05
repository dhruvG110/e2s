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
import { PlayCircle, Clock, CheckCircle } from "lucide-react";

/* ---------------- Razorpay Loader ---------------- */
const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  /* ---------------- Course ---------------- */
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  /* ---------------- Lessons ---------------- */
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", id!)
        .order("order");

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  /* ---------------- Purchase ---------------- */
  const {
    data: purchased = false,
    isLoading: purchasedLoading,
  } = useQuery({
    queryKey: ["purchased", id, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("purchases")
        .select("expires_at")
        .eq("user_id", user.id)
        .eq("course_id", id!)
        .maybeSingle();

      if (error || !data) return false;

      if (data.expires_at && new Date(data.expires_at) < new Date())
        return false;

      return true;
    },
    enabled: !!id && !!user,
  });

  if (courseLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-muted-foreground">
        Loading course...
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-red-500">
        Course not found
      </div>
    );
  }

  /* ---------------- Pricing ---------------- */
  const baseDiscount = course.discount ?? 0;
  const totalDiscount = Math.min(baseDiscount + discount, 100);
  const finalPrice = course.price * (1 - totalDiscount / 100);
  const amountPaise = Math.round(finalPrice * 100);

  /* ---------------- Promo ---------------- */
  const applyPromo = async () => {
    if (!promoCode.trim()) return;

    const res = await supabase.functions.invoke("apply-promo-code", {
      body: { code: promoCode.trim().toUpperCase() },
    });

    if (res.data?.valid) {
      setDiscount(res.data.discount_percent);
      setPromoApplied(true);
      toast.success(`Promo applied (${res.data.discount_percent}% OFF)`);
    } else {
      toast.error(res.data?.error || "Invalid promo code");
    }
  };

  /* ---------------- Buy ---------------- */
  const handleBuy = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Payment gateway failed to load");
      return;
    }

    try {
      const res = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            courseId: id,
            amount: amountPaise,
            promoCode: promoApplied ? promoCode : undefined,
          },
        }
      );

      if (res.error) throw res.error;

      const { orderId, razorpayKeyId } = res.data;

      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        amount: amountPaise,
        currency: "INR",
        name: "Edit2Scale",
        description: course.title,
        order_id: orderId,
        handler: async (response: any) => {
          const verify = await supabase.functions.invoke(
            "verify-razorpay-payment",
            {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: id,
                amountPaid: amountPaise,
                promoCode: promoApplied ? promoCode : undefined,
              },
            }
          );

          if (verify.error) {
            toast.error("Payment verification failed");
          } else {
            toast.success("Purchase successful");
            navigate(`/course/${id}/learn`);
          }
        },
        theme: { color: "#ff5c00" },
      });

      rzp.open();
    } catch {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">

        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold mb-2">
            Course <span className="gradient-text">Details</span>
          </h1>
          <p className="text-muted-foreground">
            Learn everything about this course before enrolling
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">

          <div className="lg:col-span-2 space-y-6">

            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-secondary">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold">{course.title}</h2>

              {course.category && (
                <Badge className="mt-2">{course.category}</Badge>
              )}

              <p className="mt-4 text-muted-foreground">
                {course.description}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Course Content
                </h3>

                {lessons.length === 0 ? (
                  <p className="text-muted-foreground">
                    No lessons yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson: any, i) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center gap-3">
                          <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {i + 1}. {lesson.title}
                          </span>
                        </div>

                        <span className="text-sm text-muted-foreground">
                          {lesson.duration ?? 0} min
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 border-border/50">
              <CardContent className="p-6 space-y-6">

                <div>
                  <div className="text-3xl font-bold gradient-text">
                    ₹{finalPrice.toFixed(0)}
                  </div>

                  {totalDiscount > 0 && (
                    <Badge className="mt-2 gradient-primary text-white border-0">
                      {totalDiscount}% OFF
                    </Badge>
                  )}
                </div>

                {!purchased && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      disabled={promoApplied}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />

                    <Button
                      variant="outline"
                      onClick={applyPromo}
                      disabled={promoApplied}
                    >
                      {promoApplied ? <CheckCircle /> : "Apply"}
                    </Button>
                  </div>
                )}

                {purchasedLoading ? (
                  <Button disabled className="w-full">
                    Checking access…
                  </Button>
                ) : purchased ? (
                  <Button
                    className="w-full gradient-primary text-white hover:opacity-90"
                    onClick={() => navigate(`/course/${id}/learn`)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    className="w-full gradient-primary text-white hover:opacity-90"
                    onClick={handleBuy}
                  >
                    Buy Now
                  </Button>
                )}

                <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">

                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" />
                    {lessons.length} lessons
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {lessons.reduce(
                      (a: number, l: any) => a + (l.duration ?? 0),
                      0
                    )} min total
                  </div>

                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
