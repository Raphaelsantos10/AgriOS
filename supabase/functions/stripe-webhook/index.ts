import type Stripe from "npm:stripe@18.5.0";
import { adminClient, json, stripe } from "../_shared/billing.ts";

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const signature = req.headers.get("stripe-signature");
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!signature || !secret) return json({ error: "Webhook nao configurado." }, 400);
  let event;
  try { event = await stripe.webhooks.constructEventAsync(await req.text(), signature, secret); }
  catch { return json({ error: "Assinatura do webhook invalida." }, 400); }
  const accepted = new Set(["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]);
  if (accepted.has(event.type)) {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.supabase_user_id;
    const plan = subscription.metadata.plan || "unknown";
    if (userId) {
      const item = subscription.items.data[0];
      await adminClient().from("subscriptions").upsert({ user_id: userId, stripe_customer_id: String(subscription.customer), stripe_subscription_id: subscription.id, stripe_product_id: String(item?.price.product || ""), stripe_price_id: item?.price.id || "", plan, status: subscription.status, cancel_at_period_end: subscription.cancel_at_period_end, current_period_end: new Date((item?.current_period_end || 0) * 1000).toISOString(), updated_at: new Date().toISOString() }, { onConflict: "stripe_subscription_id" });
    }
  }
  return json({ received: true });
});
