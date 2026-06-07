import React, { useMemo } from "react";

export default function InsightsCard({ expenses }) {
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  
  const optimalSavedMatrix = useMemo(() => {
    return (totalSpent * 0.25).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, [totalSpent]);

  return (
    <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black tracking-widest uppercase text-red-500 font-mono">
            System Analysis Node
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Optimizing core account outputs could instantly preserve an estimated <span className="text-red-500 font-bold">PKR {optimalSavedMatrix}</span> within this ledger profile.
          </p>
        </div>

        <div className="pt-2">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition cursor-pointer shadow-xs">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}