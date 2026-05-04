"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase";
import { optionalText, requiredText } from "@/lib/validation";

export async function createClient(formData: FormData) {
  const supabase = await createClientServer();
  const payload = {
    name: requiredText(formData, "name", "El nombre comercial"),
    business_name: optionalText(formData, "business_name"),
    contact_name: optionalText(formData, "contact_name"),
    email: optionalText(formData, "email"),
    phone: optionalText(formData, "phone"),
  };

  const { error } = await supabase.from("clients").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(clientId: string, formData: FormData) {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from("clients")
    .update({
      name: requiredText(formData, "name", "El nombre comercial"),
      business_name: optionalText(formData, "business_name"),
      contact_name: optionalText(formData, "contact_name"),
      email: optionalText(formData, "email"),
      phone: optionalText(formData, "phone"),
    })
    .eq("id", clientId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
}

export async function deleteClient(clientId: string) {
  const supabase = await createClientServer();
  const { error } = await supabase.from("clients").delete().eq("id", clientId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clients");
  redirect("/clients");
}
