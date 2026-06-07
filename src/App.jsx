import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  Settings, 
  Bell, 
  Plus
} from "lucide-react";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import QuickTransfer from "./components/QuickTransfer";
import InsightsCard from "./components/InsightsCard";

function App() {
  const [expenses, setExpenses] = useLocalStorage("personal-expenses", []);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const handleTriggerEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen notebook-grid-canvas text-black flex p-4 sm:p-6 gap-6">
      
      {/* Icon-Only Vertical Pill Navigation Dock */}
      <aside className="w-20 bg-[#09090b] rounded-[32px] flex flex-col items-center justify-between py-8 px-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)] sticky top-6 h-[calc(100vh-48px)] flex-shrink-0">
        <div className="flex flex-col items-center space-y-10 w-full">
          <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center shadow-lg shadow-red-500/20">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>

          <nav className="flex flex-col items-center space-y-3 w-full px-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === "dashboard" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab("wallets")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === "wallets" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <Wallet className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === "analytics" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </nav>
        </div>

        <button 
          onClick={() => setActiveTab("settings")}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === "settings" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </aside>

      {/* Main Panel Content Area Workspace */}
      <div className="flex-1 min-w-0 space-y-6">
        <header className="flex items-center justify-between px-2 pt-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">Dashboard</h1>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-zinc-900 text-white px-2 py-0.5 rounded-md">Velo</span>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mt-0.5 font-mono">
              {new Date().toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
              className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
            <button className="p-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-50 shadow-sm transition">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Log Input Form Overlay Block */}
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

        <div className="space-y-6">
          <ExpenseSummary expenses={expenses} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <ExpenseList 
                expenses={expenses} 
                onEditSelect={handleTriggerEdit}
                onDeleteExpense={handleDeleteExpense}
                onTriggerOpenForm={() => { setEditingExpense(null); setIsFormOpen(true); }}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <QuickTransfer />
              <InsightsCard expenses={expenses} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;