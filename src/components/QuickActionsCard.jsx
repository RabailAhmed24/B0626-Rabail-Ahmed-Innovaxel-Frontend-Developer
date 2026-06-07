import React, { useState } from "react";
import { Plus, Download, Trash2, Filter } from "lucide-react";

export default function QuickActionsCard({ onTriggerOpenForm, expenses, onClearAll, onFilterMonth }) {
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    
    const headers = ["Title", "Amount", "Category", "Date", "Notes"];
    const rows = expenses.map(e => [
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      e.category,
      e.date,
      `"${(e.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `velo_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSelectedMonth(val);
    onFilterMonth(val);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-xs space-y-4">
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-black">Utility Workspace</h3>
        <p className="text-[9px] font-bold text-zinc-400 font-mono">Direct system macro execution</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button 
          onClick={onTriggerOpenForm}
          className="p-3 bg-zinc-50 border border-zinc-200 hover:border-black rounded-xl text-left transition flex flex-col justify-between h-20 cursor-pointer group"
        >
          <Plus className="w-4 h-4 text-zinc-400 group-hover:text-black transition" />
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-900">Add Log</span>
        </button>

        <button 
          onClick={handleExportCSV}
          disabled={expenses.length === 0}
          className="p-3 bg-zinc-50 border border-zinc-200 hover:border-black rounded-xl text-left transition flex flex-col justify-between h-20 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 text-zinc-400 group-hover:text-black transition" />
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-900">Export CSV</span>
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400 mr-2 flex-shrink-0" />
          <input 
            type="month" 
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full bg-transparent text-[10px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
          />
        </div>

        <button 
          onClick={() => { if(confirm("Clear local ledger vectors?")) { onClearAll(); } }}
          className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl transition cursor-pointer"
          title="Reset Dashboard State"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}