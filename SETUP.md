# Puesta en marcha

Este archivo separa lo que ya esta listo en el proyecto de lo que requiere acceso a tus cuentas.

## Ya realizado en el proyecto

- Estructura Next.js con TypeScript y Tailwind.
- Autenticacion con Supabase Auth.
- Rutas protegidas.
- CRUD inicial de clientes.
- Carga y eliminacion de ventas.
- Carga y eliminacion de gastos.
- Dashboard mensual por cliente.
- Esquema PostgreSQL en `supabase/schema.sql`.
- Datos demo opcionales en `supabase/seed.sql`.

## Lo que tenes que hacer en Supabase

1. Crear un proyecto nuevo en Supabase.
2. Ir a SQL Editor.
3. Pegar y ejecutar el contenido de `supabase/schema.sql`.
4. Ir a Authentication > Users.
5. Crear un usuario administrador con email y clave.
6. Copiar el UID del usuario administrador.
7. Volver a SQL Editor y ejecutar:

```sql
insert into public.profiles (id, role)
values ('UID_DEL_USUARIO_ADMIN', 'admin')
on conflict (id) do update set role = excluded.role;
```

8. Ir a Project Settings > API.
9. Copiar `Project URL` y `anon public key`.

## Lo que hay que completar localmente

Crear `.env.local` en la raiz del proyecto con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_public_key
```

Despues validar:

```bash
npm run setup:check
npm run typecheck
npm run lint
npm run dev
```

## Datos de prueba

Cuando el esquema ya este creado, podes ejecutar `supabase/seed.sql` en el SQL Editor para cargar clientes, ventas y gastos demo.

## Nota sobre migraciones

`supabase/schema.sql` es idempotente para setup manual. Para un flujo con Supabase CLI, usar la carpeta `supabase/migrations` como punto de partida y crear nuevas migraciones para cambios futuros.

## Orden recomendado para empezar a desarrollar

1. Configurar Supabase y `.env.local`.
2. Abrir la app con `npm run dev`.
3. Entrar con el usuario administrador.
4. Crear un cliente real de prueba.
5. Cargar ventas y gastos del mes actual.
6. Revisar el dashboard mensual.
7. Recién ahi avanzar con mejoras de producto.
