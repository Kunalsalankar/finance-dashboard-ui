import type { Transaction } from "../types";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const totals = (transactions: Transaction[]) => {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const monthlyExpense = (transactions: Transaction[]) => {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(ym))
    .reduce((sum, t) => sum + t.amount, 0);
};
