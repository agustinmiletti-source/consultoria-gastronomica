"use server";

import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClientServer();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = encodeURIComponent(error.message);
    redirect(`/login?error=${message}`);
  }

  redirect("/clients");
}

export async function logout() {
  const supabase = await createClientServer();
  await supabase.auth.signOut();
  redirect("/login");
}
