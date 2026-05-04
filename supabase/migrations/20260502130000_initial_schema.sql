create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  contact_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  sale_date date not null,
  amount numeric(14, 2) not null check (amount >= 0),
  channel text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  expense_date date not null,
  amount numeric(14, 2) not null check (amount >= 0),
  category text not null,
  vendor text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists clients_name_idx on public.clients (name);
create index if not exists sales_client_date_idx on public.sales (client_id, sale_date);
create index if not exists expenses_client_date_idx on public.expenses (client_id, expense_date);
create index if not exists expenses_category_idx on public.expenses (category);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.sales enable row level security;
alter table public.expenses enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated admins can read clients" on public.clients;
create policy "Authenticated admins can read clients"
  on public.clients for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated admins can insert clients" on public.clients;
create policy "Authenticated admins can insert clients"
  on public.clients for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated admins can update clients" on public.clients;
create policy "Authenticated admins can update clients"
  on public.clients for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated admins can delete clients" on public.clients;
create policy "Authenticated admins can delete clients"
  on public.clients for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated admins can read sales" on public.sales;
create policy "Authenticated admins can read sales"
  on public.sales for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated admins can insert sales" on public.sales;
create policy "Authenticated admins can insert sales"
  on public.sales for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated admins can update sales" on public.sales;
create policy "Authenticated admins can update sales"
  on public.sales for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated admins can delete sales" on public.sales;
create policy "Authenticated admins can delete sales"
  on public.sales for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated admins can read expenses" on public.expenses;
create policy "Authenticated admins can read expenses"
  on public.expenses for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated admins can insert expenses" on public.expenses;
create policy "Authenticated admins can insert expenses"
  on public.expenses for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated admins can update expenses" on public.expenses;
create policy "Authenticated admins can update expenses"
  on public.expenses for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated admins can delete expenses" on public.expenses;
create policy "Authenticated admins can delete expenses"
  on public.expenses for delete
  to authenticated
  using (public.is_admin());

create or replace view public.monthly_client_metrics as
select
  c.id as client_id,
  c.name as client_name,
  months.month,
  coalesce(sales.total_sales, 0) as total_sales,
  coalesce(expenses.total_expenses, 0) as total_expenses,
  coalesce(sales.total_sales, 0) - coalesce(expenses.total_expenses, 0) as net_profit,
  case
    when coalesce(sales.total_sales, 0) > 0
      then (coalesce(sales.total_sales, 0) - coalesce(expenses.total_expenses, 0)) / sales.total_sales
    else 0
  end as net_margin,
  coalesce(expenses.total_expenses, 0) as break_even_point
from public.clients c
cross join lateral (
  select distinct date_trunc('month', sale_date)::date as month
  from public.sales where client_id = c.id
  union
  select distinct date_trunc('month', expense_date)::date as month
  from public.expenses where client_id = c.id
) months
left join lateral (
  select sum(amount) as total_sales
  from public.sales
  where client_id = c.id
    and sale_date >= months.month
    and sale_date < (months.month + interval '1 month')
) sales on true
left join lateral (
  select sum(amount) as total_expenses
  from public.expenses
  where client_id = c.id
    and expense_date >= months.month
    and expense_date < (months.month + interval '1 month')
) expenses on true;
