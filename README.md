# Consultoria Gastronomica MVP

App interna para cargar clientes gastronomicos, registrar ventas y gastos, y consultar un dashboard mensual con ventas, gastos, ganancia neta, margen y punto de equilibrio basico.

## Stack

- Next.js con App Router
- TypeScript
- Supabase Auth
- Supabase PostgreSQL
- Tailwind CSS

## Configuracion rapida

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/schema.sql` en el SQL editor de Supabase.
3. Crear un usuario administrador desde Supabase Auth.
4. Insertar el perfil admin del usuario en `public.profiles`.
5. Copiar `.env.example` a `.env.local` y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

6. Instalar dependencias y levantar la app:

```bash
npm install
npm run dev
```

Para una guia paso a paso, revisar `SETUP.md`.

Para validar la configuracion local:

```bash
npm run setup:check
npm run typecheck
npm run lint
```

## Modulos

- Login de administrador con Supabase Auth.
- CRUD de clientes.
- Alta y eliminacion de ventas por cliente.
- Alta y eliminacion de gastos por cliente.
- Dashboard mensual por cliente.
- Calculos automaticos en la app y vista SQL mensual en PostgreSQL.
- Esquema ampliado para importar la plantilla Excel gastronomica completa.

## Base de datos

El esquema principal esta en `supabase/schema.sql`. La explicacion de tablas y su relacion con la plantilla Excel esta en `supabase/README.md`.

## Siguiente mejora natural

Agregar edicion inline para ventas y gastos, filtros por categoria/canal y roles de equipo si la agencia suma mas usuarios internos.
