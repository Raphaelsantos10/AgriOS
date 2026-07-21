import { adminClient, appUrl, authenticatedUser, cors, json, stripe } from "../_shared/billing.ts";

const priceByPlan: Record<string, string | undefined> = { plus: Deno.env.get("STRIPE_PRICE_PLUS"), pro: Deno.env.get("STRIPE_PRICE_PRO") };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ error: "Autenticacao necessaria." }, 401);
  const { plan } = await req.json().catch(() => ({ plan: "" }));
  const price = priceByPlan[String(plan)];
  if (!price || !price.startsWith("price_")) return json({ error: "Plano ainda nao configurado no Stripe." }, 400);
  const db = adminClient();
  const existing = await db.from("billing_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  let customerId = existing.data?.stripe_customer_id as string | undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } });
    customerId = customer.id;
    const saved = await db.from("billing_customers").upsert({ user_id: user.id, stripe_customer_id: customerId });
    if (saved.error) return json({ error: "Nao foi possivel associar o cliente." }, 500);
  }
  const session = await stripe.checkout.sessions.create({ customer: customerId, mode: "subscription", line_items: [{ price, quantity: 1 }], success_url: appUrl("/configuracoes?checkout=success#subscricao"), cancel_url: appUrl("/configuracoes?checkout=cancelled#subscricao"), allow_promotion_codes: true, billing_address_collection: "auto", payment_method_collection: "always", client_reference_id: user.id, metadata: { supabase_user_id: user.id, plan: String(plan) }, subscription_data: { trial_period_days: 30, metadata: { supabase_user_id: user.id, plan: String(plan) } } });
  return json({ url: session.url });
});
