import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "app/login/page.tsx",
  "app/clients/page.tsx",
  "supabase/schema.sql",
];

const checks = [];

for (const file of requiredFiles) {
  checks.push({
    label: `Archivo requerido: ${file}`,
    ok: existsSync(join(root, file)),
  });
}

const envPath = join(root, ".env.local");
const hasEnv = existsSync(envPath);
checks.push({
  label: "Archivo .env.local",
  ok: hasEnv,
});

if (hasEnv) {
  const env = readFileSync(envPath, "utf8");
  checks.push({
    label: "NEXT_PUBLIC_SUPABASE_URL configurada",
    ok: /^NEXT_PUBLIC_SUPABASE_URL=.+/m.test(env),
  });
  checks.push({
    label: "NEXT_PUBLIC_SUPABASE_ANON_KEY configurada",
    ok: /^NEXT_PUBLIC_SUPABASE_ANON_KEY=.+/m.test(env),
  });
}

const failed = checks.filter((check) => !check.ok);

for (const check of checks) {
  console.log(`${check.ok ? "OK" : "FALTA"} - ${check.label}`);
}

if (failed.length > 0) {
  console.log("");
  console.log("Todavia falta completar la configuracion local.");
  process.exit(1);
}

console.log("");
console.log("Setup local listo para iniciar desarrollo.");
