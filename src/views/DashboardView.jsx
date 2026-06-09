import React, { useState } from "react";
import { Wallet, Calendar, ListTodo, Edit2, Check, X } from "lucide-react";
import ExpenseList from "../components/ExpenseList";

export default function DashboardView({
  expenses = [],
  budgets = {},
  totalBalanceOut = 0,
  monthlySpend = 0,
  activeEntries = 0,
  searchQuery = "", // Received search state
  onEditSelect,
  onDeleteExpense,
  onTriggerOpenForm,
  onClearData,
  onUpdateBudgetLimit
}) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempLimit, setTempLimit] = useState("");

  const formatCurrency = (value) => {
    const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;
    return `PKR ${numericValue.toLocaleString()}`;
  };

  const renderBudgetProgress = (category, limit) => {
    const spent = expenses
      .filter(e => e.category?.toLowerCase() === category.toLowerCase())
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    
    let barColor = "bg-[#38B2AC]"; 
    if (percentage >= 70 && percentage < 90) barColor = "bg-amber-500";
    if (percentage >= 90) barColor = "bg-red-500";

    const isCurrentlyEditing = editingCategory === category;

    return (
      <div key={category} className="space-y-1.5 group/row p-2 hover:bg-zinc-50 rounded-xl transition duration-150">
        <div className="flex justify-between items-center text-[10px] font-bold text-neutral-900">
          <span className="capitalize text-zinc-700">{category}</span>
          
          {isCurrentlyEditing ? (
            <div className="flex items-center space-x-1">
              <input 
                type="number"
                value={tempLimit}
                onChange={(e) => setTempLimit(e.target.value)}
                className="w-16 bg-white border border-zinc-300 text-right px-1 py-0.5 rounded text-[10px] font-mono focus:outline-none focus:border-black"
                autoFocus
              />
              <button 
                onClick={() => {
                  onUpdateBudgetLimit(category, tempLimit);
                  setEditingCategory(null);
                }}
                className="text-green-600 p-0.5 hover:bg-green-50 rounded"
              >
                <Check className="w-3 h-3" />
              </button>
              <button onClick={() => setEditingCategory(null)} className="text-zinc-400 p-0.5 hover:bg-zinc-100 rounded">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-zinc-400">
                {formatCurrency(spent)} / <span className="text-black font-extrabold">{formatCurrency(limit)}</span>
              </span>
              <button 
                onClick={() => {
                  setEditingCategory(category);
                  setTempLimit(limit);
                }}
                className="opacity-0 group-hover/row:opacity-100 transition-opacity p-0.5 hover:bg-zinc-200 rounded text-zinc-500 hover:text-black cursor-pointer"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>

        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden relative">
          <div 
            className={`h-full ${barColor} transition-all duration-500 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono font-bold text-zinc-400">
          <span>Target tracking</span>
          <span className={percentage >= 90 ? "text-red-500 animate-pulse" : ""}>{Math.round(percentage)}% TRAVERSED</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="bg-white border-l-4 border-zinc-900 border-y border-r border-zinc-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Balance Out</p>
            <h3 className="text-xl font-black text-black tracking-tight">{formatCurrency(totalBalanceOut)}</h3>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-900">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border-l-4 border-red-500 border-y border-r border-zinc-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Monthly Spending</p>
            <h3 className="text-xl font-black text-black tracking-tight">{formatCurrency(monthlySpend)}</h3>
          </div>
          <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-red-500">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border-l-4 border-blue-500 border-y border-r border-zinc-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Postings</p>
            <h3 className="text-xl font-black text-black tracking-tight">{activeEntries} Entries</h3>
          </div>
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-blue-500">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Column Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        
        {/* Pass down searchQuery into ExpenseList directly */}
        <div className="lg:col-span-2 space-y-6 w-full">
          <ExpenseList 
            expenses={expenses}
            searchQuery={searchQuery} // Active filtering connection
            onEditSelect={onEditSelect}
            onDeleteExpense={onDeleteExpense}
            onTriggerOpenForm={onTriggerOpenForm}
          />
        </div>

        <div className="space-y-6 w-full">
          {/* Budget Limits Grid Frame */}
          <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black">Budget Limits</h3>
              <p className="text-[10px] font-medium text-zinc-400">Real-time category target tracking status metrics</p>
            </div>
            <div className="space-y-2">
              {Object.keys(budgets).map(category => renderBudgetProgress(category, budgets[category]))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + ["Title,Amount,Category,Date"].concat(expenses.map(e => `"${e.title}",${e.amount},"${e.category}","${e.date}"`)).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "velo_finance_export.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-2.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 font-bold text-[10px] rounded-xl transition cursor-pointer text-center text-zinc-800"
              >
                Export CSV
              </button>
              <button 
                onClick={onClearData}
                className="p-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-red-600 font-bold text-[10px] rounded-xl transition cursor-pointer text-center"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}