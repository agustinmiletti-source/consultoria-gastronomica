import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { createClient } from "../actions";

export default function NewClientPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-stone-950">Nuevo cliente</h1>
        <p className="mt-1 text-sm text-stone-600">
          Datos basicos para iniciar el seguimiento mensual.
        </p>
      </div>
      <form action={createClient} className="grid max-w-2xl gap-4 rounded-lg border border-stone-200 bg-white p-6">
        <Field label="Nombre comercial" name="name" required />
        <Field label="Razon social" name="business_name" />
        <Field label="Contacto" name="contact_name" />
        <Field label="Email" name="email" type="email" />
        <Field label="Telefono" name="phone" />
        <Button type="submit" className="w-fit">
          Guardar cliente
        </Button>
      </form>
    </AppShell>
  );
}
