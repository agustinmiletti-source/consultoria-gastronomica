insert into public.clients (name, business_name, contact_name, email, phone)
select 'La Mesa del Puerto', 'La Mesa del Puerto SRL', 'Martina Lopez', 'martina@lamesa.test', '+54 11 5555-0101'
where not exists (select 1 from public.clients where name = 'La Mesa del Puerto');

insert into public.clients (name, business_name, contact_name, email, phone)
select 'Cafe Norte', 'Cafe Norte SA', 'Diego Perez', 'diego@cafenorte.test', '+54 11 5555-0102'
where not exists (select 1 from public.clients where name = 'Cafe Norte');

with first_client as (
  select id from public.clients where name = 'La Mesa del Puerto' limit 1
)
insert into public.sales (client_id, sale_date, amount, channel, notes)
select id, current_date - interval '5 days', 1450000, 'Salon', 'Semana regular' from first_client
union all
select id, current_date - interval '3 days', 380000, 'Delivery', 'Promocion online' from first_client;

with first_client as (
  select id from public.clients where name = 'La Mesa del Puerto' limit 1
)
insert into public.expenses (client_id, expense_date, amount, category, vendor, notes)
select id, current_date - interval '4 days', 520000, 'Materia prima', 'Distribuidora Central', 'Compra semanal' from first_client
union all
select id, current_date - interval '2 days', 240000, 'Sueldos', null, 'Adelantos' from first_client
union all
select id, current_date - interval '1 day', 95000, 'Servicios', 'Energia', 'Factura mensual' from first_client;
