create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  name text not null,
  business_name text,
  tax_id text,
  business_type text,
  address text,
  city text,
  province text,
  country text not null default 'Argentina',
  currency text not null default 'ARS',
  contact_name text,
  email text,
  phone text,
  report_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  file_name text not null,
  template_version text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  total_rows integer not null default 0 check (total_rows >= 0),
  processed_rows integer not null default 0 check (processed_rows >= 0),
  error_message text,
  imported_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  external_id text,
  name text not null,
  category text,
  tax_id text,
  contact_name text,
  email text,
  phone text,
  payment_terms text,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_apps (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  external_id text,
  name text not null,
  commission_pct numeric(7, 4) check (commission_pct is null or commission_pct >= 0),
  monthly_fixed_cost numeric(14, 2) check (monthly_fixed_cost is null or monthly_fixed_cost >= 0),
  payment_delay_days integer check (payment_delay_days is null or payment_delay_days >= 0),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  external_id text,
  name text not null,
  category text not null,
  sale_price numeric(14, 2) not null check (sale_price >= 0),
  vat_included boolean,
  active boolean not null default true,
  start_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  external_id text,
  name text not null,
  category text not null,
  base_unit text not null,
  reference_unit_cost numeric(14, 4) check (reference_unit_cost is null or reference_unit_cost >= 0),
  minimum_stock numeric(14, 4) check (minimum_stock is null or minimum_stock >= 0),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  delivery_app_id uuid references public.delivery_apps(id) on delete set null,
  external_id text,
  sale_date date not null,
  shift text,
  channel text,
  receipt text,
  order_count integer check (order_count is null or order_count >= 0),
  gross_amount numeric(14, 2) check (gross_amount is null or gross_amount >= 0),
  discounts numeric(14, 2) check (discounts is null or discounts >= 0),
  commissions numeric(14, 2) check (commissions is null or commissions >= 0),
  taxes numeric(14, 2) check (taxes is null or taxes >= 0),
  amount numeric(14, 2) not null check (amount >= 0),
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  external_id text,
  expense_date date not null,
  category text not null,
  subcategory text,
  description text,
  amount numeric(14, 2) not null check (amount >= 0),
  payment_method text,
  receipt text,
  is_fixed boolean,
  vendor text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  external_id text,
  purchase_date date not null,
  quantity numeric(14, 4) not null check (quantity >= 0),
  unit text not null,
  unit_price numeric(14, 4) not null check (unit_price >= 0),
  total_amount numeric(14, 2) not null check (total_amount >= 0),
  receipt text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  product_id uuid not null references public.products(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  external_id text,
  quantity numeric(14, 4) not null check (quantity >= 0),
  unit text not null,
  waste_pct numeric(7, 4) check (waste_pct is null or waste_pct >= 0),
  unit_cost numeric(14, 4) check (unit_cost is null or unit_cost >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  external_id text,
  movement_date date not null,
  movement_type text not null check (movement_type in ('Conteo', 'Entrada', 'Salida', 'Ajuste', 'Merma')),
  quantity numeric(14, 4) not null check (quantity >= 0),
  unit text not null,
  location text,
  reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_costs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  external_id text,
  staff_name text not null,
  role text not null,
  cost_date date not null,
  hours_worked numeric(10, 2) check (hours_worked is null or hours_worked >= 0),
  hourly_cost numeric(14, 2) check (hourly_cost is null or hourly_cost >= 0),
  monthly_salary numeric(14, 2) check (monthly_salary is null or monthly_salary >= 0),
  contract_type text,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  import_id uuid references public.imports(id) on delete set null,
  external_id text,
  observation_date date not null,
  area text not null,
  priority text check (priority is null or priority in ('Alta', 'Media', 'Baja')),
  description text not null,
  estimated_impact text,
  responsible text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.clients add column if not exists external_id text;
alter table public.clients add column if not exists tax_id text;
alter table public.clients add column if not exists business_type text;
alter table public.clients add column if not exists address text;
alter table public.clients add column if not exists city text;
alter table public.clients add column if not exists province text;
alter table public.clients add column if not exists country text not null default 'Argentina';
alter table public.clients add column if not exists currency text not null default 'ARS';
alter table public.clients add column if not exists report_start_date date;
alter table public.clients add column if not exists updated_at timestamptz not null default now();
alter table public.sales add column if not exists import_id uuid references public.imports(id) on delete set null;
alter table public.sales add column if not exists delivery_app_id uuid references public.delivery_apps(id) on delete set null;
alter table public.sales add column if not exists external_id text;
alter table public.sales add column if not exists shift text;
alter table public.sales add column if not exists receipt text;
alter table public.sales add column if not exists order_count integer check (order_count is null or order_count >= 0);
alter table public.sales add column if not exists gross_amount numeric(14, 2) check (gross_amount is null or gross_amount >= 0);
alter table public.sales add column if not exists discounts numeric(14, 2) check (discounts is null or discounts >= 0);
alter table public.sales add column if not exists commissions numeric(14, 2) check (commissions is null or commissions >= 0);
alter table public.sales add column if not exists taxes numeric(14, 2) check (taxes is null or taxes >= 0);
alter table public.sales add column if not exists payment_method text;
alter table public.sales add column if not exists updated_at timestamptz not null default now();
alter table public.expenses add column if not exists import_id uuid references public.imports(id) on delete set null;
alter table public.expenses add column if not exists supplier_id uuid references public.suppliers(id) on delete set null;
alter table public.expenses add column if not exists external_id text;
alter table public.expenses add column if not exists subcategory text;
alter table public.expenses add column if not exists description text;
alter table public.expenses add column if not exists payment_method text;
alter table public.expenses add column if not exists receipt text;
alter table public.expenses add column if not exists is_fixed boolean;
alter table public.expenses add column if not exists updated_at timestamptz not null default now();

create unique index if not exists clients_external_id_uidx on public.clients (external_id) where external_id is not null;
create unique index if not exists suppliers_client_external_id_uidx on public.suppliers (client_id, external_id) where external_id is not null;
create unique index if not exists delivery_apps_client_external_id_uidx on public.delivery_apps (client_id, external_id) where external_id is not null;
create unique index if not exists products_client_external_id_uidx on public.products (client_id, external_id) where external_id is not null;
create unique index if not exists ingredients_client_external_id_uidx on public.ingredients (client_id, external_id) where external_id is not null;
create unique index if not exists sales_client_external_id_uidx on public.sales (client_id, external_id) where external_id is not null;
create unique index if not exists expenses_client_external_id_uidx on public.expenses (client_id, external_id) where external_id is not null;
create unique index if not exists purchases_client_external_id_uidx on public.purchases (client_id, external_id) where external_id is not null;
create unique index if not exists recipe_items_client_external_id_uidx on public.recipe_items (client_id, external_id) where external_id is not null;
create unique index if not exists stock_movements_client_external_id_uidx on public.stock_movements (client_id, external_id) where external_id is not null;
create unique index if not exists staff_costs_client_external_id_uidx on public.staff_costs (client_id, external_id) where external_id is not null;
create unique index if not exists observations_client_external_id_uidx on public.observations (client_id, external_id) where external_id is not null;

create index if not exists clients_name_idx on public.clients (name);
create index if not exists imports_client_created_idx on public.imports (client_id, created_at);
create index if not exists suppliers_client_idx on public.suppliers (client_id);
create index if not exists delivery_apps_client_idx on public.delivery_apps (client_id);
create index if not exists products_client_idx on public.products (client_id);
create index if not exists ingredients_client_idx on public.ingredients (client_id);
create index if not exists sales_client_date_idx on public.sales (client_id, sale_date);
create index if not exists expenses_client_date_idx on public.expenses (client_id, expense_date);
create index if not exists expenses_category_idx on public.expenses (category);
create index if not exists purchases_client_date_idx on public.purchases (client_id, purchase_date);
create index if not exists purchases_supplier_idx on public.purchases (supplier_id);
create index if not exists purchases_ingredient_idx on public.purchases (ingredient_id);
create index if not exists recipe_items_client_idx on public.recipe_items (client_id);
create index if not exists recipe_items_product_idx on public.recipe_items (product_id);
create index if not exists recipe_items_ingredient_idx on public.recipe_items (ingredient_id);
create index if not exists stock_movements_client_date_idx on public.stock_movements (client_id, movement_date);
create index if not exists stock_movements_ingredient_idx on public.stock_movements (ingredient_id);
create index if not exists staff_costs_client_date_idx on public.staff_costs (client_id, cost_date);
create index if not exists observations_client_date_idx on public.observations (client_id, observation_date);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'clients', 'imports', 'suppliers', 'delivery_apps',
    'products', 'ingredients', 'sales', 'expenses', 'purchases',
    'recipe_items', 'stock_movements', 'staff_costs', 'observations'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', 'set_' || table_name || '_updated_at', table_name);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      'set_' || table_name || '_updated_at',
      table_name,
      table_name
    );
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.imports enable row level security;
alter table public.suppliers enable row level security;
alter table public.delivery_apps enable row level security;
alter table public.products enable row level security;
alter table public.ingredients enable row level security;
alter table public.sales enable row level security;
alter table public.expenses enable row level security;
alter table public.purchases enable row level security;
alter table public.recipe_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.staff_costs enable row level security;
alter table public.observations enable row level security;

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

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'clients', 'imports', 'suppliers', 'delivery_apps', 'products',
    'ingredients', 'sales', 'expenses', 'purchases', 'recipe_items',
    'stock_movements', 'staff_costs', 'observations'
  ]
  loop
    execute format('drop policy if exists "Authenticated admins can read %s" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Authenticated admins can insert %s" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Authenticated admins can update %s" on public.%I', table_name, table_name);
    execute format('drop policy if exists "Authenticated admins can delete %s" on public.%I', table_name, table_name);

    execute format(
      'create policy "Authenticated admins can read %s" on public.%I for select to authenticated using (public.is_admin())',
      table_name,
      table_name
    );
    execute format(
      'create policy "Authenticated admins can insert %s" on public.%I for insert to authenticated with check (public.is_admin())',
      table_name,
      table_name
    );
    execute format(
      'create policy "Authenticated admins can update %s" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      table_name,
      table_name
    );
    execute format(
      'create policy "Authenticated admins can delete %s" on public.%I for delete to authenticated using (public.is_admin())',
      table_name,
      table_name
    );
  end loop;
end $$;

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
