# Esquema de datos gastronomico

Este esquema prepara Supabase/PostgreSQL para importar la plantilla oficial de Excel y almacenar informacion multi-cliente.

## Relacion con la plantilla Excel

- `clients`: datos maestros del cliente gastronomico. Se alimenta desde `datos_negocio`.
- `imports`: registro de cada archivo Excel importado, estado, filas procesadas y errores.
- `sales`: ventas diarias o por canal. Se alimenta desde `ventas`.
- `expenses`: gastos operativos. Se alimenta desde `gastos`.
- `purchases`: compras de insumos a proveedores. Se alimenta desde `compras`.
- `suppliers`: proveedores por cliente. Se alimenta desde `proveedores`.
- `products`: productos vendidos por el negocio. Se alimenta desde `productos`.
- `ingredients`: insumos usados en compras, stock y recetas. Se alimenta desde `insumos`.
- `recipe_items`: lineas de ficha tecnica que vinculan productos con insumos. Se alimenta desde `fichas_tecnicas`.
- `stock_movements`: conteos y movimientos de stock. Se alimenta desde `stock`.
- `staff_costs`: costos de personal por fecha o periodo. Se alimenta desde `personal`.
- `delivery_apps`: configuracion de apps de delivery por cliente. Se alimenta desde `apps_delivery`.
- `observations`: observaciones operativas o economicas. Se alimenta desde `observaciones`.

## Reglas de relacion

- Todas las tablas principales usan `id uuid primary key`.
- Las tablas de negocio tienen `client_id` para soportar multiples clientes.
- Las columnas `external_id` guardan los IDs de la plantilla Excel, como `PROD_001`, `INS_001` o `PROV_001`.
- Las relaciones internas usan UUIDs reales, por ejemplo `purchases.supplier_id` referencia `suppliers.id`.
- `imports.id` permite saber de que archivo vino cada registro importado.
- `created_at` y `updated_at` permiten auditar altas y cambios.

## Seguridad

Las tablas tienen Row Level Security activo. Por ahora, solo usuarios con perfil `admin` en `public.profiles` pueden leer o modificar datos.

## Migraciones

- `schema.sql`: version idempotente para ejecutar manualmente desde SQL Editor.
- `migrations/20260502130000_initial_schema.sql`: migracion inicial del MVP.
- `migrations/20260502233000_expand_import_schema.sql`: migracion ampliada para importar la plantilla completa.
