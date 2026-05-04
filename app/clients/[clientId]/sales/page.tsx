import { Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { ClientNav } from "@/components/ClientNav";
import { Field } from "@/components/Field";
import type { Sale } from "@/lib/database.types";
import { createClientServer } from "@/lib/supabase";
import { createSale, deleteSale, updateSale } from "../records-actions";

export const dynamic = "force-dynamic";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClientServer();
  const { data: sales, error } = await supabase
    .from("sales")
    .select("*")
    .eq("client_id", clientId)
    .order("sale_date", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <AppShell>
      <h1 className="mb-2 text-3xl font-semibold text-stone-950">Ventas</h1>
      <ClientNav clientId={clientId} />

      <form
        action={createSale.bind(null, clientId)}
        className="mb-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-6 md:grid-cols-4"
      >
        <Field label="Fecha" name="sale_date" type="date" required />
        <Field label="Monto" name="amount" type="number" min="0" step="0.01" required />
        <Field label="Canal" name="channel" placeholder="Salon, delivery..." />
        <Field label="Notas" name="notes" />
        <Button type="submit" className="w-fit md:col-span-4">
          Agregar venta
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Notas</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {(sales as Sale[]).map((sale) => {
              const formId = `sale-${sale.id}`;

              return (
                <tr key={sale.id}>
                  <td className="px-4 py-3">
                    <form
                      id={formId}
                      action={updateSale.bind(null, clientId, sale.id)}
                    />
                    <input
                      form={formId}
                      name="sale_date"
                      type="date"
                      defaultValue={sale.sale_date}
                      className="h-9 w-full min-w-32 rounded-md border border-stone-300 bg-white px-2 text-sm"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={formId}
                      name="channel"
                      defaultValue={sale.channel ?? ""}
                      className="h-9 w-full min-w-32 rounded-md border border-stone-300 bg-white px-2 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={formId}
                      name="notes"
                      defaultValue={sale.notes ?? ""}
                      className="h-9 w-full min-w-40 rounded-md border border-stone-300 bg-white px-2 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={formId}
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={sale.amount}
                      className="h-9 w-full min-w-28 rounded-md border border-stone-300 bg-white px-2 text-sm font-medium"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        form={formId}
                        type="submit"
                        className="inline-flex size-9 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-50"
                        aria-label="Guardar venta"
                      >
                        <Save size={16} />
                      </button>
                  <form action={deleteSale.bind(null, clientId, sale.id)}>
                    <button
                      type="submit"
                      className="inline-flex size-9 items-center justify-center rounded-md text-red-700 hover:bg-red-50"
                      aria-label="Eliminar venta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
