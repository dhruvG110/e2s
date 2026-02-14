import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function computeHmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.claims.sub;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amountPaid, promoCode } = await req.json();

    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RAZORPAY_KEY_SECRET) {
      return new Response(JSON.stringify({ error: "Razorpay not configured" }), { status: 500, headers: corsHeaders });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = await computeHmacSha256(RAZORPAY_KEY_SECRET, body);

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), { status: 400, headers: corsHeaders });
    }

    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    await adminClient.from("razorpay_payments").update({
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
      status: "paid",
    }).eq("order_id", razorpay_order_id);

    const { data: payment } = await adminClient.from("razorpay_payments").select("id").eq("order_id", razorpay_order_id).maybeSingle();

    // Set expiry to 3 years from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 3);

    await adminClient.from("purchases").insert({
      user_id: userId,
      course_id: courseId,
      amount_paid: amountPaid,
      razorpay_payment_id: payment?.id,
      promo_code_used: promoCode || null,
      expires_at: expiresAt.toISOString(),
    });

    if (promoCode) {
      await adminClient.rpc("increment_promo_usage" as any, { promo_code: promoCode });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
