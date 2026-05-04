"use server";

import { revalidatePath } from "next/cache";
import { createClientServer } from "@/lib/supabase";
import { optionalText, requiredAmount, requiredText } from "@/lib/validation";

export async function createSale(clientId: string, formData: FormData) {
  const supabase = await createClientServer();
  const { error } = await supabase.from("sales").insert({
    client_id: clientId,
    sale_date: requiredText(formData, "sale_date", "La fecha"),
    amount: requiredAmount(formData),
    channel: optionalText(formData, "channel"),
    notes: optionalText(formData, "notes"),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${clientId}/sales`);
  revalidatePath(`/clients/${clientId}/dashboard`);
}

export async function deleteSale(clientId: string, saleId: string) {
  const supabase = await createClientServer();
  const { error } = await supabase.from("sales").delete().eq("id", saleId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${clientId}/sales`);
  revalidatePath(`/clients/${clientId}/dashboard`);
}

export async function updateSale(
  clientId: string,
  saleId: string,
  formData: FormData,
) {
  const supabase = await createClientServer();
  const { error } = await supabase
    .from("sales")
    .update({
      sale_date: requiredText(formData, "sale_date", "La fecha"),
      amount: requiredAmount(formData),
      channel: optionalText(formData, "channel"),
      notes: optionalText(formData, "notes"),
    })
    .eq("id", saleId)
    .eq("client_id", clientId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${clientId}/sales`);
  revalidatePath(`/clients/${clientId}/dashboard`);
}

export async function createExpense(clientId: string, formData: FormData) {
  const supabase = await createClientServer();
  const { error } = await supabase.from("expenses").insert({
    client_id: clientId,
    expense_date: requiredText(formData, "expense_date", "La fecha"),
    amount: requiredAmount(formData),
    category: requiredText(formData, "category", "La categoria"),
    vendor: optionalText(formData, "vendor"),
    notes: optionalText(formData, "notes"),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${clientId}/expenses`);
  revalidatePath(`/clients/${clientId}/dashboard`);
}

export async function deleteExpense(clientId: string, expenseId: string) {
  const supabase = await createClientServer();
  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${clientId}/expenses`);
  revalidatePath(`/clients/${clientId}/dashboard`);
}

export async function updateExpense(
  clientId: string,
  expenseId: string,
  formData: FormData,
) {
  const supabase = await createClientServer();
  const { error } = await supabase
    .from("expenses")
    .update({
      expense_date: requiredText(formData, "expense_date", "La fecha"),
      amount: requiredAmount(formData),
      category: requiredText(formData, "category", "La categoria"),
      vendor: optionalText(formData, "vendor"),
      notes: optionalText(formData, "notes"),
    })
    .eq("id", expenseId)
    .eq("client_id", clientId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${clientId}/expenses`);
  revalidatePath(`/clients/${clientId}/dashboard`);
}
