import { Filter } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { ClientNav } from "@/components/ClientNav";
import { MetricCard } from "@/components/MetricCard";
import { calculateDashboardMetrics } from "@/lib/calculations";
import type { Expense, Sale } from "@/lib/database.types";
import { createClientServer } from "@/lib/supabase";
import { currentMonth, formatCurrency, formatPercent, monthRange } from "@/lib/utils";

export default async function ClientDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { clientId } = await params;
  const { month = currentMonth() } = await searchParams;
  const range = monthRange(month);
  const supabase = await createClientServer();

  const [clientResult, salesResult, expensesResult] = await Promise.all([
    supabase.from("clients").select("*").eq("id", clientId).single(),
    supabase
      .from("sales")
      .select("amount")
      .eq("client_id", clientId)
      .gte("sale_date", range.start)
      .lt("sale_date", range.end),
    supabase
      .from("expenses")
      .select("amount, category")
      .eq("client_id", clientId)
      .gte("expense_date", range.start)
      .lt("expense_date", range.end),
  ]);

  if (clientResult.error) throw new Error(clientResult.error.message);
  if (salesResult.error) throw new Error(salesResult.error.message);
  if (expensesResult.error) throw new Error(expensesResult.error.message);

  const metrics = calculateDashboardMetrics(
    salesResult.data as Pick<Sale, "amount">[],
    expensesResult.data as Pick<Expense, "amount" | "category">[],
  );

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">Dashboard mensual</p>
          <h1 className="text-3xl font-semibold text-stone-950">
            {clientResult.data.name}
          </h1>
        </div>
        <form className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1 text-sm font-medium text-stone-700">
            Mes
            <input
              name="month"
              type="month"
              defaultValue={month}
              className="h-10 rounded-md border border-stone-300 bg-white px-3"
            />
          </label>
          <Button type="submit" variant="secondary">
            <Filter size={16} />
            Aplicar
          </Button>
        </form>
      </div>

      <ClientNav clientId={clientId} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Ventas" value={formatCurrency(metrics.totalSales)} />
        <MetricCard label="Gastos" value={formatCurrency(metrics.totalExpenses)} />
        <MetricCard
          label="Ganancia neta"
          value={formatCurrency(metrics.netProfit)}
          tone={metrics.netProfit >= 0 ? "good" : "bad"}
        />
        <MetricCard label="Margen neto" value={formatPercent(metrics.netMargin)} />
        <MetricCard
          label="Punto de equilibrio"
          value={formatCurrency(metrics.breakEvenPoint)}
        />
      </div>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-950">Gastos por categoria</h2>
        <div className="mt-4 grid gap-3">
          {metrics.expensesByCategory.length === 0 ? (
            <p className="text-sm text-stone-500">Todavia no hay gastos en este mes.</p>
          ) : (
            metrics.expensesByCategory.map((item) => (
              <div key={item.category} className="grid gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-800">{item.category}</span>
                  <span className="text-stone-600">{formatCurrency(item.total)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full bg-emerald-700"
                    style={{
                      width: `${Math.max(
                        4,
                        (item.total / Math.max(metrics.totalExpenses, 1)) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}
