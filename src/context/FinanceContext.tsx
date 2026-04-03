import { createContext, useContext, useMemo, useState } from "react";
import { mockTransactions } from "../data/mockTransactions";
import type { Role, Transaction } from "../types";

interface FinanceContextValue {
  role: Role;
  setRole: (role: Role) => void;
  transactions: Transaction[];
  addTransaction: (entry: Omit<Transaction, "id">) => void;
  editTransaction: (id: number, entry: Omit<Transaction, "id">) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

const TRANSACTIONS_KEY = "finance_dashboard_transactions";
const DARKMODE_KEY = "finance_dashboard_darkmode";

const readTransactions = (): Transaction[] => {
  const raw = localStorage.getItem(TRANSACTIONS_KEY);
  if (!raw) return mockTransactions;
  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    return mockTransactions;
  }
};

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("viewer");
  const [transactions, setTransactions] = useState<Transaction[]>(readTransactions);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem(DARKMODE_KEY) === "1");

  const addTransaction = (entry: Omit<Transaction, "id">) => {
    setTransactions((prev) => {
      const next = [...prev, { ...entry, id: Date.now() }];
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const editTransaction = (id: number, entry: Omit<Transaction, "id">) => {
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === id ? { id, ...entry } : t));
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(DARKMODE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const value = useMemo(
    () => ({ role, setRole, transactions, addTransaction, editTransaction, darkMode, toggleDarkMode }),
    [role, transactions, darkMode],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
};
