import React, { useMemo } from "react";
import { categoryColors, defaultColor } from "../utils/colors";

export default function BudgetHealthCard({ expenses, budgets }) {
  const categoryStatus = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    return Object.keys(budgets).map((cat) => {
      const spent = totals[cat] || 0;
      const limit = budgets[cat];
      const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

      // Status indicator thresholds based on target consumption rates
      let indicatorStyle = "bg-emerald-500";
      if (percent >= 90) indicatorStyle = "bg-red-500";
      else if (percent >= 70) indicatorStyle = "bg-amber-500";

      return { name: cat, spent, limit, percent, indicatorStyle };
    });
  }, [expenses, budgets]);

  return (
    <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-xs space-y-4">
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-black">Budget Limits</h3>
        <p className="text-[9px] font-bold text-zinc-400 font-mono">Real-time target consumption</p>
      </div>

      <div className="space-y-3.5">
        {categoryStatus.map((cat) => {
          const normalizedName = cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase();
          const themeColor = categoryColors[normalizedName] || defaultColor;

          return (
            <div key={cat.name} className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                  <span className="text-zinc-600">{cat.name}</span>
                </div>
                <span className="text-black font-mono">
                  PKR {cat.spent.toLocaleString()} / {cat.limit.toLocaleString()} ({cat.percent.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${cat.indicatorStyle}`} 
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}