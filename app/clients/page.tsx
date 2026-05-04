import { Plus } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import type { Client } from "@/lib/database.types";
import { createClientServer } from "@/lib/supabase";

export default async function ClientsPage() {
  const supabase = await createClientServer();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-stone-950">Clientes</h1>
          <p className="mt-1 text-sm text-stone-600">
            Restaurantes, bares y negocios gastronomicos activos.
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Plus size={16} />
          Nuevo
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {(clients as Client[]).map((client) => (
              <tr key={client.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-950">{client.name}</p>
                  <p className="text-stone-500">{client.business_name}</p>
                </td>
                <td className="px-4 py-3 text-stone-700">{client.contact_name}</td>
                <td className="px-4 py-3 text-stone-700">{client.email}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/clients/${client.id}/dashboard`}
                    className="font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
