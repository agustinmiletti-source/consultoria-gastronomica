export function requiredText(formData: FormData, field: string, label: string) {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    throw new Error(`${label} es obligatorio.`);
  }

  return value;
}

export function optionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value || null;
}

export function requiredAmount(formData: FormData, field = "amount") {
  const value = Number(formData.get(field));

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("El monto debe ser un numero mayor o igual a cero.");
  }

  return value;
}
