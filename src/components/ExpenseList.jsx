import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Edit2, Trash2, ArrowUpDown } from "lucide-react";

/**
 * ExpenseList Component
 * Controls granular dataset filtering based on categorical indices, handles 
 * interactive color status mapping indicators, and updates list data records.
 */
export default function ExpenseList({ expenses, onEditSelect, onDeleteExpense, onTriggerOpenForm }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter categorization array mapping tabs
  const categories = ["All", "Food", "Utilities", "Entertainment", "Transport"];

  // Exact 4 distinct structural color values synchronized across charts and indicator dots
  const categoryColors = {
    Food: "#E53E3E",          // Red Accent
    Entertainment: "#4A90D9", // Blue Accent
    Utilities: "#F6AD55",     // Amber Accent
    Transport: "#38B2AC"      // Teal Accent
  };

  // FIX ISSUE 2: Enforced precise lowercase structural comparison
  const processedExpenses = useMemo(() => {
    let dataset = [...expenses];
    if (activeCategory.toLowerCase() !== "all") {
      dataset = dataset.filter((i) => i.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    return dataset.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [expenses, activeCategory, sortDirection]);

  const categoryChartData = useMemo(() => {
    const counts = {};
    expenses.forEach((item) => {
      if (!item.category) return;
      const normalizedCat = item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase();
      counts[normalizedCat] = (counts[normalizedCat] || 0) + item.amount;
    });
    return Object.keys(counts).map((name) => ({ name, value: counts[name] }));
  }, [expenses]);

  const totalDonutVolume = useMemo(() => {
    return categoryChartData.reduce((sum, item) => sum + item.value, 0);
  }, [categoryChartData]);

  const graphTimelineData = useMemo(() => {
    const dailyMap = {};
    expenses.slice(0, 15).forEach((item) => {
      dailyMap[item.date] = (dailyMap[item.date] || 0) + item.amount;
    });
    return Object.keys(dailyMap)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => ({
        formattedDate: new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        amount: dailyMap[date]
      }));
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Spending Over Time Analysis Element */}
        <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Spending Over Time</h3>
            <p className="text-[9px] font-bold text-zinc-400 font-mono">Timeline Vector Analysis</p>
          </div>

          {graphTimelineData.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/40 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Insufficient data mapped</p>
            </div>
          ) : (
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphTimelineData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="crimsonGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedDate" tick={{ fill: "#a1a1aa", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `PKR ${val}`} tick={{ fill: "#a1a1aa", fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#crimsonGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Breakdown Donut Chart Element */}
        <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Category Breakdown</h3>
            <p className="text-[9px] font-bold text-zinc-400 font-mono">Asset Vector Distribution</p>
          </div>

          {categoryChartData.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/40 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">No data yet</p>
            </div>
          ) : (
            <div className="w-full h-44 flex items-center justify-between relative">
              
              <div className="w-1/2 h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={categoryChartData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={36} 
                      outerRadius={48} 
                      paddingAngle={3} 
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || "#71717a"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#09090b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Total</span>
                  <span className="text-xs font-black text-black leading-none">PKR {totalDonutVolume.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="w-1/2 space-y-2 max-h-full overflow-y-auto ledger-scroll-zone pl-2">
                {categoryChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] font-bold">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: categoryColors[item.name] || "#71717a" }} 
                      />
                      <span className="text-zinc-500 truncate">{item.name}</span>
                    </div>
                    <span className="text-black font-mono pl-1">PKR {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Ledger Interface Frame Workspace */}
      <div className="bg-white border border-zinc-200 rounded-[24px] overflow-hidden shadow-xs">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              Recent Transactions
              <button onClick={() => setSortDirection(p => p === "desc" ? "asc" : "desc")} className="p-1 hover:bg-zinc-100 rounded text-zinc-400 transition cursor-pointer">
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </h3>
            <p className="text-[9px] font-bold text-zinc-400 font-mono">Realtime historical output</p>
          </div>
          
          <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all flex-shrink-0 cursor-pointer ${activeCategory.toLowerCase() === cat.toLowerCase() ? "bg-black text-white shadow-xs" : "text-zinc-500 hover:text-black"}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Category Legend Indicator Ribbon */}
        <div className="px-5 py-2.5 bg-zinc-50/50 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-zinc-100">
          <span className="text-[9px] font-bold uppercase font-mono tracking-wider text-zinc-400">Color Dot Legend:</span>
          {Object.keys(categoryColors).map((catName) => (
            <div key={catName} className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: categoryColors[catName] }} />
              <span className="text-[10px] font-bold text-zinc-600">{catName}</span>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5 divide-y divide-zinc-100 max-h-[300px] overflow-y-auto ledger-scroll-zone">
          {processedExpenses.length === 0 ? (
            <div className="py-12 text-center max-w-sm mx-auto space-y-3">
              <p className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-wider">No matching records found in local scope</p>
              <button onClick={onTriggerOpenForm} className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer hover:bg-zinc-900">
                Create Initial Posting
              </button>
            </div>
          ) : (
            processedExpenses.map((item) => {
              const formattedCatName = item.category?.charAt(0).toUpperCase() + item.category?.slice(1).toLowerCase();
              const displayColor = categoryColors[formattedCatName] || "#71717a";

              return (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 relative">
                      <div 
                        className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125" 
                        style={{ backgroundColor: displayColor }}
                      />
                      <div 
                        className="absolute inset-0 rounded-full opacity-10" 
                        style={{ backgroundColor: displayColor }}
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-black tracking-tight truncate">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-black block">PKR {item.amount.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-zinc-400 block font-mono uppercase tracking-wide">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-1 pl-2 border-l border-zinc-100">
                      <button onClick={() => onEditSelect(item)} className="p-1 text-zinc-400 hover:text-black transition cursor-pointer">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => onDeleteExpense(item.id)} className="p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}