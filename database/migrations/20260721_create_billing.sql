create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique not null,
  stripe_product_id text not null,
  stripe_price_id text not null,
  plan text not null check (plan in ('free','plus','pro','unknown')),
  status text not null,
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;

create policy "users read own billing customer" on public.billing_customers for select to authenticated using (auth.uid() = user_id);
create policy "users read own subscription" on public.subscriptions for select to authenticated using (auth.uid() = user_id);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
