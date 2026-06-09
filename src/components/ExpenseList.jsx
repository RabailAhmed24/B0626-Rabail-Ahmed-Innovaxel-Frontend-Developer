import React, { useState, useMemo } from "react";
import { ArrowUpDown, Edit3, Trash2 } from "lucide-react";
import Skeleton from "react-loading-skeleton"; // Import skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Import styles

export default function ExpenseList({ 
  expenses = [], 
  searchQuery = "", 
  onEditSelect, 
  onDeleteExpense, 
  onTriggerOpenForm,
  loading = false // New prop added
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc");

  const categoryCounts = useMemo(() => {
    const counts = { all: expenses.length, food: 0, utilities: 0, entertainment: 0, transport: 0 };
    expenses.forEach((item) => {
      const cat = item.category?.toLowerCase();
      if (cat && counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  }, [expenses]);

  const processedExpenses = useMemo(() => {
    let dataset = [...expenses];
    
    if (activeCategory.toLowerCase() !== "all") {
      dataset = dataset.filter((i) => i.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      dataset = dataset.filter(
        (i) => i.title.toLowerCase().includes(query) || i.category?.toLowerCase().includes(query)
      );
    }

    return dataset.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [expenses, activeCategory, sortDirection, searchQuery]);

  const formatCurrency = (value) => {
    return `PKR ${Number(value).toLocaleString()}`;
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "food": return "bg-red-500";
      case "entertainment": return "bg-blue-500";
      case "utilities": return "bg-amber-500";
      case "transport": return "bg-teal-500";
      default: return "bg-zinc-400";
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-[32px] p-6 shadow-xs space-y-6 w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-black">Recent Transactions</h3>
            <button 
              onClick={() => setSortDirection(prev => prev === "desc" ? "asc" : "desc")}
              className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-black rounded-lg transition cursor-pointer"
              title="Toggle sorting order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] font-medium text-zinc-400 mt-0.5">Your recent bookkeeping ledger entries</p>
        </div>

        <div className="flex flex-wrap gap-1 bg-zinc-50 p-1 rounded-xl border border-zinc-200">
          {["all", "food", "utilities", "entertainment", "transport"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeCategory === cat 
                  ? "bg-black text-white shadow-xs" 
                  : "text-zinc-500 hover:text-black hover:bg-zinc-100"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[8px] px-1 rounded ${activeCategory === cat ? "bg-zinc-800 text-zinc-200" : "bg-zinc-200 text-zinc-600"}`}>
                {categoryCounts[cat]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 min-h-[220px]">
        {loading ? (
          // Skeleton Loader State
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-zinc-100 rounded-2xl">
              <div className="flex items-center space-x-3.5 w-full">
                <Skeleton circle width={8} height={8} />
                <div className="flex-1">
                  <Skeleton width="60%" height={12} />
                  <Skeleton width="30%" height={10} className="mt-1" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton width={50} height={12} />
              </div>
            </div>
          ))
        ) : processedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-zinc-100 rounded-2xl min-h-[220px]">
            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center mb-3 text-zinc-400 border border-zinc-100">📁</div>
            <h4 className="text-xs font-bold text-neutral-900">No transactions recorded</h4>
            <p className="text-[10px] text-zinc-400 max-w-[240px] mt-1 font-medium">We couldn't find any data matching your requirements.</p>
            <button onClick={onTriggerOpenForm} className="mt-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 text-[10px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">
              Add Ledger Item
            </button>
          </div>
        ) : (
          processedExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-3.5 bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl shadow-2xs transition group duration-200"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getCategoryColor(expense.category)}`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-900 tracking-tight truncate max-w-[180px] sm:max-w-xs">{expense.title}</p>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono mt-0.5">
                    {new Date(expense.date).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs font-black text-black tracking-tight font-mono">{formatCurrency(expense.amount)}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">{expense.category || "General"}</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 border-l pl-2 border-zinc-100">
                  <button onClick={() => onEditSelect(expense)} className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-black rounded transition cursor-pointer" title="Edit Record">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDeleteExpense(expense.id)} className="p-1 hover:bg-rose-50 text-zinc-400 hover:text-red-600 rounded transition cursor-pointer" title="Delete Record">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}