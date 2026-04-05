import { useEffect, useState } from "react";
import type { Transaction, TransactionType } from "../types";

interface TransactionFormProps {
  initial?: Transaction;
  onSubmit: (entry: Omit<Transaction, "id">) => void;
  onCancelEdit?: () => void;
}

export function TransactionForm({ initial, onSubmit, onCancelEdit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [amount, setAmount] = useState<string>(String(initial?.amount ?? ""));
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [date, setDate] = useState<string>(initial?.date ?? "");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setType(initial?.type ?? "expense");
    setAmount(initial ? String(initial.amount) : "");
    setCategory(initial?.category ?? "");
    setDate(initial?.date ?? "");
    setError("");
  }, [initial]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      setError("Please fill all fields.");
      return;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    onSubmit({ type, amount: Number(amount), category: category.trim(), date });
    setError("");
    if (!initial) {
      setAmount("");
      setCategory("");
      setDate("");
      setType("expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:grid-cols-4">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" placeholder="Amount" className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-slate-700" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-slate-700" />
      <div className="flex gap-2">
        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-slate-700" />
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
          {initial ? "Update" : "Add"}
        </button>
        {initial && onCancelEdit ? (
          <button type="button" onClick={onCancelEdit} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="md:col-span-4 text-xs text-rose-500">{error}</p> : null}
    </form>
  );
}
