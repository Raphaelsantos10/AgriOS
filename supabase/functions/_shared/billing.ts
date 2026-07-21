import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.110.2";

export const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { httpClient: Stripe.createFetchHttpClient() });
export const cors = { "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") || "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
export function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } }); }
export function adminClient() { return createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "", { auth: { persistSession: false } }); }
export async function authenticatedUser(req: Request) {
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data } = await adminClient().auth.getUser(token);
  return data.user || null;
}
export function appUrl(path: string) { return new URL(path, Deno.env.get("APP_ORIGIN") || "http://localhost:5173").toString(); }

