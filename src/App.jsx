import React, { useState, useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { 
  LayoutDashboard, 
  Wallet as WalletIcon, 
  BarChart3, 
  Settings as SettingsIcon, 
  Bell
} from "lucide-react";

import DashboardView from "./views/DashboardView";
import WalletView from "./views/WalletView";
import AnalyticsView from "./views/AnalyticsView";
import SettingsView from "./views/SettingsView";
import NotificationDropdown from "./components/NotificationDropdown";
import ExpenseForm from "./components/ExpenseForm";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [expenses, setExpenses] = useLocalStorage("personal-expenses", []);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [budgets, setBudgets] = useLocalStorage("budget-limits", {
    Food: 15000,
    Utilities: 25000,
    Entertainment: 10000,
    Transport: 8000
  });

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    setIsFormOpen(false);
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === updatedExpense.id ? updatedExpense : item))
    );
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllData = () => {
    setExpenses([]);
  };

  const hasUnreadAlerts = useMemo(() => {
    const counts = {};
    expenses.forEach(e => counts[e.category] = (counts[e.category] || 0) + e.amount);
    return Object.keys(budgets).some(cat => (counts[cat] || 0) >= budgets[cat] * 0.8);
  }, [expenses, budgets]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black flex p-4 sm:p-6 gap-6 w-full overflow-x-hidden font-sans">
      
      {/* Left Navigation Sidebar */}
      <aside className="w-20 bg-[#09090b] rounded-[32px] flex flex-col items-center justify-between py-8 px-2 shadow-xl sticky top-6 h-[calc(100vh-48px)] flex-shrink-0 z-40">
        <div className="flex flex-col items-center space-y-10 w-full">
          <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>

          <nav className="flex flex-col items-center space-y-3 w-full px-2">
            <button 
              onClick={() => setActiveView("dashboard")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "dashboard" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveView("wallet")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "wallet" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <WalletIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveView("analytics")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "analytics" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </nav>
        </div>

        <button 
          onClick={() => setActiveView("settings")}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "settings" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </aside>

      {/* Main Container Window — Notice flex-1 and w-full */}
      <div className="flex-1 w-full min-w-0 flex flex-col space-y-6 relative">
        <header className="flex items-center justify-between px-2 pt-2 w-full">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 capitalize">{activeView}</h1>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-zinc-900 text-white px-2 py-0.5 rounded-md">Velo</span>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mt-0.5 font-mono">
              {new Date().toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>

          <div className="flex items-center space-x-3 relative">
            <button 
              onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
              className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <span>Log Expense</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2.5 bg-white border rounded-xl shadow-sm transition relative cursor-pointer ${isNotifOpen ? "border-black bg-zinc-50" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
              >
                <Bell className="w-4 h-4" />
                {hasUnreadAlerts && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
              {isNotifOpen && (
                <NotificationDropdown 
                  expenses={expenses} 
                  budgets={budgets} 
                  onClose={() => setIsNotifOpen(false)} 
                />
              )}
            </div>
          </div>
        </header>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <ExpenseForm 
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                editingExpense={editingExpense}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}

        {/* View Layout Canvas wrapper */}
        <main className="w-full flex-1 animate-in fade-in duration-200">
          {activeView === "dashboard" && (
            <DashboardView 
              expenses={expenses} 
              budgets={budgets} 
              onEditSelect={handleUpdateExpense} 
              onDeleteExpense={handleDeleteExpense}
              onTriggerOpenForm={() => { setEditingExpense(null); setIsFormOpen(true); }}
              onClearData={handleClearAllData}
            />
          )}
          {activeView === "wallet" && <WalletView expenses={expenses} />}
          {activeView === "analytics" && <AnalyticsView expenses={expenses} />}
          {activeView === "settings" && <SettingsView budgets={budgets} setBudgets={setBudgets} onClearData={handleClearAllData} />}
        </main>
      </div>

    </div>
  );
}

export default App;