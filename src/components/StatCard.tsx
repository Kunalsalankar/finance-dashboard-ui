import { formatCurrency } from "../utils/finance";

interface StatCardProps {
  label: string;
  value: number;
  accent?: string;
}

export function StatCard({ label, value, accent = "text-slate-900 dark:text-slate-100" }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 transition hover:-translate-y-0.5 dark:bg-slate-900 dark:ring-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent}`}>{formatCurrency(value)}</p>
    </div>
  );
}
