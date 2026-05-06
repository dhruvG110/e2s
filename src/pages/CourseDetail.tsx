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
import { toast } from "sonner";
import { useState } from "react";
import { PlayCircle, Clock, Tag, CheckCircle } from "lucide-react";

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
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
      if (data.expires_at && new Date(data.expires_at) < new Date())
        return false;

      return true;
    },
    enabled: !!id && !!user,
  });

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading course…
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Course not found
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
        theme: { color: "#8b5cf6" },
      });

      razorpay.open();
    } catch {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-xl overflow-hidden bg-secondary mb-6">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <PlayCircle className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          {course.category && (
            <Badge variant="secondary">{course.category}</Badge>
          )}
          <p className="mt-4 text-muted-foreground">{course.description}</p>
        </div>

        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="text-3xl font-bold">
                ₹{finalPrice.toFixed(0)}
              </div>
              {totalDiscount > 0 && (
                <Badge className="mt-2">{totalDiscount}% OFF</Badge>
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
              <Button disabled>Checking access…</Button>
            ) : purchased ? (
              <Button onClick={() => navigate(`/course/${id}/learn`)}>
                Continue Learning
              </Button>
            ) : (
              <Button onClick={handleBuy}>Buy Now</Button>
            )}

            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex gap-2">
                <PlayCircle className="h-4 w-4" />
                {lessons.length} lessons
              </div>
              <div className="flex gap-2">
                <Clock className="h-4 w-4" />
                {lessons.reduce((a, l) => a + (l.duration ?? 0), 0)} min
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
