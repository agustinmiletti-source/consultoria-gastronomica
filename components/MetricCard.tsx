export function MetricCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p
        className={
          "mt-2 text-2xl font-semibold " +
          (tone === "good"
            ? "text-emerald-700"
            : tone === "bad"
              ? "text-red-700"
              : "text-stone-950")
        }
      >
        {value}
      </p>
    </section>
  );
}
