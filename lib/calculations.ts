import type { Expense, Sale } from "@/lib/database.types";

export type DashboardMetrics = {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  netMargin: number;
  breakEvenPoint: number;
  expensesByCategory: Array<{ category: string; total: number }>;
};

export function calculateDashboardMetrics(
  sales: Pick<Sale, "amount">[],
  expenses: Pick<Expense, "amount" | "category">[],
): DashboardMetrics {
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );
  const netProfit = totalSales - totalExpenses;
  const netMargin = totalSales > 0 ? netProfit / totalSales : 0;

  const categoryMap = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + Number(expense.amount);
    return acc;
  }, {});

  return {
    totalSales,
    totalExpenses,
    netProfit,
    netMargin,
    breakEvenPoint: totalExpenses,
    expensesByCategory: Object.entries(categoryMap)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total),
  };
}
