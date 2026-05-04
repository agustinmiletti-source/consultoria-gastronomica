import { Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { ClientNav } from "@/components/ClientNav";
import { Field, SelectField } from "@/components/Field";
import type { Expense } from "@/lib/database.types";
import { createClientServer } from "@/lib/supabase";
import { createExpense, deleteExpense, updateExpense } from "../records-actions";

export const dynamic = "force-dynamic";

const expenseCategories = [
  "Materia prima",
  "Sueldos",
  "Alquiler",
  "Servicios",
  "Marketing",
  "Impuestos",
  "Otros",
];

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClientServer();
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("client_id", clientId)
    .order("expense_date", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <AppShell>
      <h1 className="mb-2 text-3xl font-semibold text-stone-950">Gastos</h1>
      <ClientNav clientId={clientId} />

      <form
        action={createExpense.bind(null, clientId)}
        className="mb-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-6 md:grid-cols-5"
      >
        <Field label="Fecha" name="expense_date" type="date" required />
        <Field label="Monto" name="amount" type="number" min="0" step="0.01" required />
        <SelectField label="Categoria" name="category" options={expenseCategories} />
        <Field label="Proveedor" name="vendor" />
        <Field label="Notas" name="notes" />
        <Button type="submit" className="w-fit md:col-span-5">
          Agregar gasto
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Proveedor</th>
              <th className="px-4 py-3 font-medium">Notas</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {(expenses as Expense[]).map((expense) => {
              const formId = `expense-${expense.id}`;

              return (
                <tr key={expense.id}>
                  <td className="px-4 py-3">
                    <form
                      id={formId}
                      action={updateExpense.bind(null, clientId, expense.id)}
                    />
                    <input
                      form={formId}
                      name="expense_date"
                      type="date"
                      defaultValue={expense.expense_date}
                      className="h-9 w-full min-w-32 rounded-md border border-stone-300 bg-white px-2 text-sm"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      form={formId}
                      name="category"
                      defaultValue={expense.category}
                      className="h-9 w-full min-w-36 rounded-md border border-stone-300 bg-white px-2 text-sm"
                    >
                      {expenseCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={formId}
                      name="vendor"
                      defaultValue={expense.vendor ?? ""}
                      className="h-9 w-full min-w-36 rounded-md border border-stone-300 bg-white px-2 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={formId}
                      name="notes"
                      defaultValue={expense.notes ?? ""}
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
                      defaultValue={expense.amount}
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
                        aria-label="Guardar gasto"
                      >
                        <Save size={16} />
                      </button>
                  <form action={deleteExpense.bind(null, clientId, expense.id)}>
                    <button
                      type="submit"
                      className="inline-flex size-9 items-center justify-center rounded-md text-red-700 hover:bg-red-50"
                      aria-label="Eliminar gasto"
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
