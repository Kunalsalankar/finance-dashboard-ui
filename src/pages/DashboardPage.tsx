import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useFinance } from "../context/FinanceContext";
import { StatCard } from "../components/StatCard";
import { totals, monthlyExpense, formatCurrency } from "../utils/finance";

const pieColors = ["#f97316", "#8b5cf6", "#06b6d4", "#22c55e", "#f43f5e", "#64748b"];

export default function DashboardPage() {
  const { transactions } = useFinance();
  const summary = totals(transactions);
  let running = 0;
  const trendData = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => {
      running += t.type === "income" ? t.amount : -t.amount;
      return { date: t.date.slice(5), balance: running };
    });

  const spendByCategory = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {}),
  ).map(([name, value]) => ({ name, value }));

  const topCategory = spendByCategory.sort((a, b) => b.value - a.value)[0];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Balance</p>
            <Wallet size={18} className="text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.balance)}</p>
        </div>
        <StatCard label="Total Income" value={summary.income} accent="text-green-600" />
        <StatCard label="Total Expenses" value={summary.expenses} accent="text-rose-600" />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-3">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Balance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Spending by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendByCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                  {spendByCategory.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-500">Highest Spending Category</p>
          <p className="mt-2 flex items-center gap-2 font-semibold">
            <ArrowDown size={16} className="text-rose-500" />
            {topCategory ? `${topCategory.name} (${formatCurrency(topCategory.value)})` : "No expense yet"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Expenses This Month</p>
          <p className="mt-2 flex items-center gap-2 font-semibold">
            <ArrowDown size={16} className="text-rose-500" />
            {formatCurrency(monthlyExpense(transactions))}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-500">Income vs Expense</p>
          <p className="mt-2 flex items-center gap-2 font-semibold">
            <ArrowUp size={16} className="text-green-500" />
            {summary.expenses === 0 ? "No expense yet" : `${Math.round((summary.income / summary.expenses) * 100)}% ratio`}
          </p>
        </div>
      </section>
    </div>
  );
}
