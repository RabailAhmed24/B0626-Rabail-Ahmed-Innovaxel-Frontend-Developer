import React, { useState } from "react";
import { ArrowRight, Send } from "lucide-react";

export default function QuickTransfer() {
  const [transferAmount, setTransferAmount] = useState("");
  
  const targetProfiles = [
    { name: "Ali", initials: "AM" },
    { name: "Sara", initials: "SK" },
    { name: "Zain", initials: "ZH" }
  ];

  return (
    <div className="premium-notebook-card p-6 space-y-5">
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-black">Quick Action Node</h3>
        <p className="text-[10px] font-bold text-zinc-400 font-mono mt-0.5">Asset Redirection</p>
      </div>

      {/* Target Profiles Row List */}
      <div className="flex items-center gap-3">
        {targetProfiles.map((p, idx) => (
          <button key={idx} className="flex flex-col items-center space-y-1.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-200 group-hover:border-black bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center justify-center transition">
              {p.initials}
            </div>
            <span className="text-[10px] font-bold text-zinc-500 group-hover:text-black">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Numerical Entry Input */}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-xs font-bold text-zinc-400 font-mono">PKR</span>
        <input
          type="number"
          placeholder="0.00"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="w-full bg-zinc-50 text-xs font-black pl-12 pr-12 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition"
        />
        <button className="absolute right-2 p-2 bg-black hover:bg-zinc-800 text-white rounded-lg transition cursor-pointer">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}