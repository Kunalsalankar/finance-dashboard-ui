import { Moon, Sun } from "lucide-react";
import { NavLink, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import { useFinance } from "./context/FinanceContext";
import type { Role } from "./types";

export default function App() {
  const { role, setRole, darkMode, toggleDarkMode } = useFinance();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <header className="mb-6 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Finance Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Simple, clean, and responsive personal finance tracker</p>
            </div>
            <div className="mt-3 flex items-center gap-2 sm:mt-0">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={toggleDarkMode} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          <nav className="mb-6 flex gap-2">
            <NavLink to="/" end className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"}`}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"}`}>
              Transactions
            </NavLink>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
