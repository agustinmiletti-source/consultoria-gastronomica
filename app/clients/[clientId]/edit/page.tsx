import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { ClientNav } from "@/components/ClientNav";
import { Field } from "@/components/Field";
import { createClientServer } from "@/lib/supabase";
import { deleteClient, updateClient } from "../../actions";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClientServer();
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error) throw new Error(error.message);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-700">Cliente</p>
        <h1 className="text-3xl font-semibold text-stone-950">{client.name}</h1>
      </div>
      <ClientNav clientId={clientId} />

      <form
        action={updateClient.bind(null, clientId)}
        className="grid max-w-2xl gap-4 rounded-lg border border-stone-200 bg-white p-6"
      >
        <Field label="Nombre comercial" name="name" defaultValue={client.name} required />
        <Field
          label="Razon social"
          name="business_name"
          defaultValue={client.business_name ?? ""}
        />
        <Field
          label="Contacto"
          name="contact_name"
          defaultValue={client.contact_name ?? ""}
        />
        <Field label="Email" name="email" type="email" defaultValue={client.email ?? ""} />
        <Field label="Telefono" name="phone" defaultValue={client.phone ?? ""} />
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>

      <form action={deleteClient.bind(null, clientId)} className="mt-4">
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-red-700 px-4 text-sm font-medium text-white hover:bg-red-800"
        >
          <Trash2 size={16} />
          Eliminar cliente
        </button>
      </form>
    </AppShell>
  );
}
