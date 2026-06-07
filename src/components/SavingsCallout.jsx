import React, { useMemo } from "react";
import { Lightbulb } from "lucide-react";

export default function SavingsCallout({ expenses }) {
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  
  const estimatedSavings = useMemo(() => {
    return (totalSpent * 0.25).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, [totalSpent]);

  return (
    <div className="border-2 border-[#000000] rounded-2xl p-6 bg-[#c6ef4e] shadow-[3px_3px_0px_#000000] relative overflow-hidden">
      <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
        <Lightbulb className="w-32 h-32 text-black" />
      </div>
      
      <div className="relative z-10 space-y-3">
        <span className="text-[10px] font-black bg-black text-white px-2.5 py-1 rounded uppercase tracking-widest">
          Optimization Node
        </span>
        <h3 className="text-lg font-black tracking-tight leading-tight uppercase text-black pt-1">
          How to reduce expenses by 25%?
        </h3>
        <p className="text-xs font-bold text-black/80 leading-relaxed">
          Based on current asset outlays, optimizing structural operational overhead could immediately redirect up to <span className="underline font-black">PKR {estimatedSavings}</span> back to capital balances.
        </p>
        <div className="pt-2">
          <button className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-neutral-800 transition cursor-pointer">
            Analyze Vectors
          </button>
        </div>
      </div>
    </div>
  );
}