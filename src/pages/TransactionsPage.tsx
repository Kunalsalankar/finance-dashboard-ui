import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { TransactionForm } from "../components/TransactionForm";
import { formatCurrency } from "../utils/finance";
import type { Transaction } from "../types";

type FilterType = "all" | "income" | "expense";
type SortBy = "date" | "amount";

export default function TransactionsPage() {
  const { role, transactions, addTransaction, editTransaction } = useFinance();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [editing, setEditing] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return [...transactions]
      .filter((t) => (filter === "all" ? true : t.type === filter))
      .filter((t) => [t.category, t.type].join(" ").toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sortBy === "date" ? b.date.localeCompare(a.date) : b.amount - a.amount));
  }, [transactions, filter, query, sortBy]);

  return (
    <div className="space-y-4">
      {role === "admin" ? (
        <TransactionForm
          initial={editing ?? undefined}
          onSubmit={(entry) => {
            if (editing) {
              editTransaction(editing.id, entry);
              setEditing(null);
            } else {
              addTransaction(entry);
            }
          }}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Switch role to Admin to add or edit transactions.
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by category or type..."
            className="w-full rounded-xl border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-slate-700"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as FilterType)} className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No transactions found. Try changing filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${row.type === "income" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {role === "admin" ? (
                        <button onClick={() => setEditing(row)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900">
                          Edit
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Viewer</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
