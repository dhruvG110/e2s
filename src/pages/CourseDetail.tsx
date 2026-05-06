import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as { Razorpay?: unknown }).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const formatPrice = (value: number) =>
  `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

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
        // @ts-expect-error - Supabase strict typing
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        // @ts-expect-error - Supabase strict typing
        .eq("course_id", id!)
        .order("order");

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  const { data: purchased = false, isLoading: purchasedLoading } = useQuery({
    queryKey: ["purchased", id, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("purchases")
        .select("expires_at")
        // @ts-expect-error - Supabase strict typing
        .eq("user_id", user.id)
        // @ts-expect-error - Supabase strict typing
        .eq("course_id", id!)
        .maybeSingle();

      if (error || !data) return false;
      if (
        (data as any)?.expires_at &&
        new Date((data as any).expires_at) < new Date()
      )
        return false;

      return true;
    },
    enabled: !!id && !!user,
  });

  if (courseLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="glass-card-strong rounded-[2rem] px-8 py-10 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Loading Course
          </p>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="glass-card-strong rounded-[2rem] px-8 py-10 text-center">
          <p className="font-display text-5xl text-white">Course Not Found</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            This course may have been removed
          </p>
        </div>
      </div>
    );
  }

  const baseDiscount = (course as any)?.discount ?? 0;
  const totalDiscount = Math.min(baseDiscount + discount, 100);
  const finalPrice = (course as any)?.price * (1 - totalDiscount / 100);
  const amountPaise = Math.round(finalPrice * 100);
  const totalDuration = lessons.reduce(
    (total: number, lesson: any) => total + (lesson?.duration ?? 0),
    0,
  );

  const applyPromo = async () => {
    if (!promoCode.trim()) return;

    const response = await supabase.functions.invoke("apply-promo-code", {
      body: { code: promoCode.trim().toUpperCase() },
    });

    if (response.data?.valid) {
      setDiscount(response.data.discount_percent);
      setPromoApplied(true);
      toast.success(`Promo applied (${response.data.discount_percent}% off)`);
    } else {
      toast.error(response.data?.error || "Invalid promo code");
    }
  };

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
      const response = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            courseId: id,
            amount: amountPaise,
            promoCode: promoApplied ? promoCode : undefined,
          },
        },
      );

      if (response.error) throw response.error;

      const { orderId, razorpayKeyId } = response.data;
      const RazorpayCtor = (window as any).Razorpay;

      const razorpay = new RazorpayCtor({
        key: razorpayKeyId,
        amount: amountPaise,
        currency: "INR",
        name: "Edit2Scale",
        description: (course as any)?.title,
        order_id: orderId,
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verification = await supabase.functions.invoke(
            "verify-razorpay-payment",
            {
              body: {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                courseId: id,
                amountPaid: amountPaise,
                promoCode: promoApplied ? promoCode : undefined,
              },
            },
          );

          if (verification.error) {
            toast.error("Payment verification failed");
          } else {
            toast.success("Purchase successful");
            navigate(`/course/${id}/learn`);
          }
        },
        theme: { color: "#ff6124" },
      });

      razorpay.open();
    } catch {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 pt-28">
      <div className="cinematic-bg" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10 space-y-4"
        >
          <span className="section-kicker">Course Overview</span>
          <h1 className="section-title max-w-4xl text-[clamp(3.6rem,10vw,6.4rem)]">
            Course{" "}
            <span className="block bg-gradient-to-r from-[#ff5c00] to-[#9d00ff] bg-clip-text text-transparent">
              Details
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Learn everything about this course before enrolling
          </p>
        </motion.div>

        <div className="grid gap-10 xl:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="space-y-6"
          >
            <div className="hero-frame p-4 md:p-6">
              <div className="relative z-10 space-y-6">
                <div className="overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/30">
                  {(course as any)?.thumbnail_url ? (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={(course as any)?.thumbnail_url}
                        alt={(course as any)?.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white/25" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {(course as any)?.category && (
                    <Badge
                      variant="outline"
                      className="border-white/12 bg-white/[0.03] text-white/75"
                    >
                      {(course as any)?.category}
                    </Badge>
                  )}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white">
                    {(course as any)?.title}
                  </h2>
                  <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                    {(course as any)?.description}
                  </p>
                </div>
              </div>
            </div>

            <Card className="glass-card-strong">
              <CardContent className="space-y-5 p-6 md:p-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/48">
                    Course Content
                  </p>
                  <h3 className="mt-3 text-4xl text-white">Lessons</h3>
                </div>

                {lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No lessons yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson: any, index: number) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/8 bg-black/20 px-4 py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] font-display text-2xl text-white/75">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-white/80 md:text-base">
                            {lesson.title}
                          </span>
                        </div>

                        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                          <Clock className="h-4 w-4" />
                          {lesson.duration ?? 0} Min
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Card className="glass-card-strong lg:sticky lg:top-28 overflow-hidden">
              <div className="h-1 w-full gradient-primary" />
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/48">
                    Enrollment
                  </p>
                  <div className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl gradient-text">
                    {formatPrice(finalPrice)}
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 line-through">
                        {formatPrice((course as any)?.price)}
                      </p>
                      <Badge className="gradient-bg border-transparent">
                        {totalDiscount}% Off
                      </Badge>
                    </div>
                  )}
                </div>

                {!purchased && (
                  <div className="flex gap-2 md:gap-3">
                    <div className="glow-input flex-1 rounded-[1.1rem]">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        disabled={promoApplied}
                        onChange={(event) => setPromoCode(event.target.value)}
                        className="text-sm md:text-base"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={applyPromo}
                      disabled={promoApplied}
                      className="border-white/10 bg-white/[0.03] px-3 md:px-5 text-sm md:text-base"
                    >
                      {promoApplied ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                )}

                {purchasedLoading ? (
                  <Button disabled className="w-full">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Checking Access
                  </Button>
                ) : purchased ? (
                  <Button
                    className="gradient-bg glow-button w-full border-transparent"
                    onClick={() => navigate(`/course/${id}/learn`)}
                  >
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="gradient-bg glow-button w-full border-transparent"
                    onClick={handleBuy}
                  >
                    Buy Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                <div className="grid gap-3">
                  <div className="metric-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                        <PlayCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        Lessons
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {lessons.length}
                    </span>
                  </div>

                  <div className="metric-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        Total Duration
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {totalDuration} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
