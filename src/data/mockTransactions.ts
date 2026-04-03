import type { Transaction } from "../types";

export const mockTransactions: Transaction[] = [
  { id: 1, type: "income", amount: 5000, category: "Salary", date: "2026-04-01" },
  { id: 2, type: "expense", amount: 1200, category: "Food", date: "2026-04-02" },
  { id: 3, type: "expense", amount: 800, category: "Travel", date: "2026-04-03" },
  { id: 4, type: "expense", amount: 420, category: "Shopping", date: "2026-04-06" },
  { id: 5, type: "income", amount: 1200, category: "Freelance", date: "2026-04-09" },
  { id: 6, type: "expense", amount: 300, category: "Bills", date: "2026-04-10" },
  { id: 7, type: "expense", amount: 520, category: "Transport", date: "2026-04-14" },
];
