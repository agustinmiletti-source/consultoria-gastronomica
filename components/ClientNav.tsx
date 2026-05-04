import { BarChart3, ReceiptText, Settings, TrendingUp } from "lucide-react";
import Link from "next/link";

export function ClientNav({ clientId }: { clientId: string }) {
  const items = [
    { href: `/clients/${clientId}/dashboard`, label: "Dashboard", icon: BarChart3 },
    { href: `/clients/${clientId}/sales`, label: "Ventas", icon: TrendingUp },
    { href: `/clients/${clientId}/expenses`, label: "Gastos", icon: ReceiptText },
    { href: `/clients/${clientId}/edit`, label: "Datos", icon: Settings },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 hover:bg-stone-50"
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
