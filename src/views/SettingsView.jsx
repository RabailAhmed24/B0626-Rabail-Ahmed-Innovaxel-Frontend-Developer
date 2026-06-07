import React, { useState } from "react";
import { Sliders, ShieldAlert } from "lucide-react";

export default function SettingsView({ budgets, setBudgets, onClearData }) {
  const [localBudgets, setLocalBudgets] = useState({ ...budgets });
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveBudgets = (e) => {
    e.preventDefault();
    setBudgets(localBudgets);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Category Target Budget Limit Editors */}
      <form onSubmit={handleSaveBudgets} className="lg:col-span-7 bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs space-y-5">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-zinc-900" />
          <h3 className="text-xs font-black uppercase tracking-wider text-black">Target Threshold Configurations</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(localBudgets).map((cat) => (
            <div key={cat} className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">{cat} Limit (PKR)</label>
              <input
                type="number"
                value={localBudgets[cat]}
                onChange={(e) => setLocalBudgets({ ...localBudgets, [cat]: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-50 text-xs font-black px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition"
              />
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[10px] font-medium text-zinc-400">Updates sync to the Dashboard Health card gauges instantly.</p>
          <button type="submit" className="bg-black hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition cursor-pointer">
            {isSaved ? "Parameters Confirmed" : "Commit Changes"}
          </button>
        </div>
      </form>

      {/* Dangerous/Master Scope Data Purge Blocks */}
      <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-red-500">
          <ShieldAlert className="w-4 h-4" />
          <h3 className="text-xs font-black uppercase tracking-wider">Administrative Master Controls</h3>
        </div>
        
        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
          Executing a destructive clear sequence completely unlinks and unmounts all cached local transaction profiles. This action is permanent and cannot be undone.
        </p>

        <div className="pt-2">
          <button 
            onClick={() => { if(confirm("Confirm clean reset on all transactional vectors?")) { onClearData(); alert("Storage purged."); } }}
            className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-[10px] font-black uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
          >
            Purge Local Memory Scope
          </button>
        </div>
      </div>

    </div>
  );
}