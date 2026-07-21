import { adminClient, appUrl, authenticatedUser, cors, json, stripe } from "../_shared/billing.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const user = await authenticatedUser(req);
  if (!user) return json({ error: "Autenticacao necessaria." }, 401);
  const result = await adminClient().from("billing_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  if (!result.data?.stripe_customer_id) return json({ error: "Cliente Stripe ainda nao criado." }, 404);
  const session = await stripe.billingPortal.sessions.create({ customer: result.data.stripe_customer_id, return_url: appUrl("/configuracoes#subscricao") });
  return json({ url: session.url });
});

