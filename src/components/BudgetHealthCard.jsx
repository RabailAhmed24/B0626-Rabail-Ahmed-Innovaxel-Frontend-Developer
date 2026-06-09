import React, { useMemo } from "react";

export default function BudgetHealthCard({ expenses, budgets }) {
  // Aggregate expenses dynamically by category context
  const targetSpentSums = useMemo(() => {
    const sums = { Food: 0, Utilities: 0, Entertainment: 0, Transport: 0 };
    expenses.forEach((item) => {
      if (!item.category) return;
      const normalizedCat = item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase();
      if (sums.hasOwnProperty(normalizedCat)) {
        sums[normalizedCat] += item.amount;
      }
    });
    return sums;
  }, [expenses]);

  // Data structure iteration array map
  const budgetTracks = Object.keys(budgets).map((key) => {
    const maxLimit = budgets[key] || 1;
    const currentSpent = targetSpentSums[key] || 0;
    const calculatedRatio = Math.min(Math.round((currentSpent / maxLimit) * 100), 100);

    // UX IMPROVEMENT: Grading conditional selector tool configuration
    let progressColorClass = "bg-emerald-500"; // Default Safe (0-60%)
    let badgeColorClass = "text-emerald-600 bg-emerald-50";

    if (calculatedRatio > 60 && calculatedRatio <= 80) {
      progressColorClass = "bg-amber-500"; // Warning Zone (61-80%)
      badgeColorClass = "text-amber-600 bg-amber-50";
    } else if (calculatedRatio > 80) {
      progressColorClass = "bg-rose-500"; // Danger Zone (81-100%)
      badgeColorClass = "text-rose-600 bg-rose-50";
    }

    return {
      categoryName: key,
      currentSpent,
      maxLimit,
      ratio: calculatedRatio,
      color: progressColorClass,
      badge: badgeColorClass
    };
  });

  return (
    <div className="space-y-4">
      {budgetTracks.map((bar) => (
        <div key={bar.categoryName} className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-zinc-600">{bar.categoryName}</span>
            <div className="flex items-center space-x-1 text-zinc-400 font-mono font-medium">
              <span className="text-black font-bold">PKR {bar.currentSpent.toLocaleString()}</span>
              <span>/</span>
              <span>{bar.maxLimit.toLocaleString()}</span>
            </div>
          </div>

          {/* Bar track background frame container */}
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full ${bar.color} transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)`}
              style={{ width: `${bar.ratio}%` }}
            />
          </div>

          <div className="flex justify-end">
            <span className={`text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-md ${bar.badge}`}>
              {bar.ratio}% Traversed
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}