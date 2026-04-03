import { useState } from "react";
import type { Transaction, TransactionType } from "../types";

interface TransactionFormProps {
  initial?: Transaction;
  onSubmit: (entry: Omit<Transaction, "id">) => void;
}

export function TransactionForm({ initial, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [amount, setAmount] = useState<string>(String(initial?.amount ?? ""));
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [date, setDate] = useState<string>(initial?.date ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    onSubmit({ type, amount: Number(amount), category, date });
    if (!initial) {
      setAmount("");
      setCategory("");
      setDate("");
      setType("expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:grid-cols-4">
      <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-slate-700">
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
      </div>
    </form>
  );
}
