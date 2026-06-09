import React, { useState, useMemo, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { 
  LayoutDashboard, 
  Wallet as WalletIcon, 
  BarChart3, 
  Settings as SettingsIcon, 
  Bell,
  Search
} from "lucide-react";

import DashboardView from "./views/DashboardView";
import WalletView from "./views/WalletView";
import AnalyticsView from "./views/AnalyticsView";
import SettingsView from "./views/SettingsView";
import NotificationDropdown from "./components/NotificationDropdown";
import NotebookPageBackground from "./components/NotebookPageBackground";
import ExpenseFormModal from "./components/ExpenseFormModal"; // Form modal link checked

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [expenses, setExpenses] = useLocalStorage("personal-expenses", []);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Dynamic Real-time Search State 

  const [budgets, setBudgets] = useLocalStorage("budget-limits", {
    Food: 15000,
    Utilities: 25000,
    Entertainment: 10000,
    Transport: 8000
  });

  // --- UX FEATURE: Keyboard Shortcut Framework --- [cite: 112, 114]
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Input processing scenarios text handling skip
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return;
      }
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setEditingExpense(null);
        setIsFormOpen(true); // Open modal form pipeline [cite: 114]
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleUpdateBudgetLimit = (category, newLimit) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: parseFloat(newLimit) || 0
    }));
  };

  // --- Calculations ---
  const totalBalanceOut = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [expenses]);

  const monthlySpend = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses
      .filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [expenses]);

  const activeEntries = useMemo(() => expenses.length, [expenses]);

  const hasUnreadAlerts = useMemo(() => {
    const counts = {};
    expenses.forEach(e => counts[e.category] = (counts[e.category] || 0) + e.amount);
    return Object.keys(budgets).some(cat => (counts[cat] || 0) >= budgets[cat] * 0.8);
  }, [expenses, budgets]);

  return (
    <NotebookPageBackground>
      <div className="flex flex-row w-full min-h-[calc(100vh-48px)] gap-6 items-start">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-20 bg-[#09090b] rounded-[32px] flex flex-col items-center justify-between py-8 px-2 shadow-xl sticky top-6 h-[calc(100vh-48px)] flex-shrink-0 z-40">
          <div className="flex flex-col items-center space-y-10 w-full">
            <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>

            <nav className="flex flex-col items-center space-y-5 w-full px-2">
              <div className="relative group flex justify-center w-full">
                <button 
                  onClick={() => setActiveView("dashboard")}
                  onMouseEnter={() => setHoveredIcon("Dashboard")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "dashboard" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
                {hoveredIcon === "Dashboard" && (
                  <div className="absolute left-16 top-3 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg z-50 pointer-events-none whitespace-nowrap border border-zinc-800">
                    Dashboard
                  </div>
                )}
              </div>

              <div className="relative group flex justify-center w-full">
                <button 
                  onClick={() => setActiveView("wallet")}
                  onMouseEnter={() => setHoveredIcon("Wallet")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "wallet" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
                >
                  <WalletIcon className="w-5 h-5" />
                </button>
                {hoveredIcon === "Wallet" && (
                  <div className="absolute left-16 top-3 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg z-50 pointer-events-none whitespace-nowrap border border-zinc-800">
                    Wallet View
                  </div>
                )}
              </div>

              <div className="relative group flex justify-center w-full">
                <button 
                  onClick={() => setActiveView("analytics")}
                  onMouseEnter={() => setHoveredIcon("Analytics")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "analytics" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                {hoveredIcon === "Analytics" && (
                  <div className="absolute left-16 top-3 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg z-50 pointer-events-none whitespace-nowrap border border-zinc-800">
                    Analytics
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="relative group flex justify-center w-full">
            <button 
              onClick={() => setActiveView("settings")}
              onMouseEnter={() => setHoveredIcon("Settings")}
              onMouseLeave={() => setHoveredIcon(null)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${activeView === "settings" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            {hoveredIcon === "Settings" && (
              <div className="absolute left-16 top-3 bg-zinc-950 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg z-50 pointer-events-none whitespace-nowrap border border-zinc-800">
                Configurations
              </div>
            )}
          </div>
        </aside>

        {/* Right Dashboard Workspace Window */}
        <div className="flex-1 min-w-0 flex flex-col space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 pt-2 w-full">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-neutral-900 capitalize">{activeView}</h1>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-zinc-900 text-white px-2 py-0.5 rounded-md">Velo</span>
              </div>
              <p className="text-xs font-semibold text-zinc-400 mt-0.5 font-mono">
                {new Date().toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
            </div>

            {/* HEADER CONTROLS AREA: Search + Notification + CTA layout mapping */}
            <div className="flex items-center space-x-3 relative flex-1 sm:justify-end max-w-xl w-full">
              
              {/* Active Quick Search bar embedded in Header */}
              {activeView === "dashboard" && (
                <div className="relative flex items-center flex-1 max-w-xs transition-all duration-300">
                  <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-400 pointer-events-none" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    [cite_start]onChange={(e) => setSearchQuery(e.target.value)} // Continuous Search state sync 
                    placeholder="Search transactions..."
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-black shadow-sm transition"
                  />
                </div>
              )}

              {/* LOG EXPENSE CTA BUTTON FIXED */}
              <button 
                onClick={() => { 
                  setEditingExpense(null); // Clear previous parameters
                  setIsFormOpen(true);     // Trigger visibility layer to true
                }}
                className="bg-black hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer flex-shrink-0"
              >
                <span>Log Expense</span>
              </button>
              
              <div className="relative flex-shrink-0">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`p-2.5 bg-white border rounded-xl shadow-sm transition relative cursor-pointer ${
                    isNotifOpen ? "border-black bg-zinc-50 text-black scale-95" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {hasUnreadAlerts && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
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

          <main className="w-full flex-1 animate-in fade-in duration-200">
            {activeView === "dashboard" && (
              <DashboardView 
                expenses={expenses} 
                budgets={budgets} 
                totalBalanceOut={totalBalanceOut}
                monthlySpend={monthlySpend}
                activeEntries={activeEntries}
                [cite_start]searchQuery={searchQuery} // Passed down to filter transactions [cite: 60]
                onEditSelect={(expense) => {
                  setEditingExpense(expense);
                  setIsFormOpen(true);
                }} 
                onDeleteExpense={handleDeleteExpense}
                onTriggerOpenForm={() => { setEditingExpense(null); setIsFormOpen(true); }}
                onClearData={handleClearAllData}
                onUpdateBudgetLimit={handleUpdateBudgetLimit}
              />
            )}
            {activeView === "wallet" && <WalletView expenses={expenses} />}
            {activeView === "analytics" && <AnalyticsView expenses={expenses} />}
            {activeView === "settings" && <SettingsView budgets={budgets} setBudgets={setBudgets} onClearData={handleClearAllData} />}
          </main>
        </div>

      </div>

      {/* --- FORM MODAL OVERLAY PORTAL ACTION --- */}
      {isFormOpen && (
        <ExpenseFormModal 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
          expenseToEdit={editingExpense}
        />
      )}

    </NotebookPageBackground>
  );
}

export default App;