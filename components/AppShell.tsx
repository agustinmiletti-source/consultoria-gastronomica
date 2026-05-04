import { LogOut, Users } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/login/actions";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/clients" className="text-lg font-semibold text-stone-950">
            Consultoria Gastronomica
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/clients"
              className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              <Users size={16} />
              Clientes
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                <LogOut size={16} />
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
