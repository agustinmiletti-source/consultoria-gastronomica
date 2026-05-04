import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error
    ? decodeURIComponent(params.error)
    : null;

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-emerald-700 text-white">
            <LockKeyhole size={20} />
          </div>
          <h1 className="text-2xl font-semibold text-stone-950">Acceso administrador</h1>
          <p className="mt-1 text-sm text-stone-600">
            Ingresar al panel interno de clientes gastronomicos.
          </p>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <form action={login} className="grid gap-4">
          <Field label="Email" name="email" type="email" required />
          <Field label="Clave" name="password" type="password" required />
          <Button type="submit">Ingresar</Button>
        </form>
      </section>
    </main>
  );
}
