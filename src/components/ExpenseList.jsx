import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Edit2, Trash2, Calendar, FileText, ArrowUpDown } from "lucide-react";

export default function ExpenseList({ expenses, onEditSelect, onDeleteExpense, onTriggerOpenForm }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");

  const processedExpenses = useMemo(() => {
    let dataset = [...expenses];
    if (activeCategory !== "All") {
      dataset = dataset.filter((i) => i.category === activeCategory);
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
      counts[item.category] = (counts[item.category] || 0) + item.amount;
    });
    return Object.keys(counts).map((name) => ({ name, value: counts[name] }));
  }, [expenses]);

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

  const PIE_COLORS = ["#09090b", "#ef4444", "#71717a", "#d4d4d8"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending Flow Matrix */}
        <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black">Spending Flow Matrix</h3>
              <p className="text-[9px] font-bold text-zinc-400 font-mono">Timeline Vector Analysis</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded font-mono">Live Area Graph</span>
          </div>

          {graphTimelineData.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/40 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Insufficient transactional data for projection mapping</p>
            </div>
          ) : (
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphTimelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="crimsonGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedDate" tick={{ fill: "#a1a1aa", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#crimsonGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Spending By Category</h3>
          </div>

          {categoryChartData.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/40 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">No data yet</p>
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-between">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={4} dataKey="value">
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#09090b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-1/2 space-y-1.5 max-h-full overflow-y-auto ledger-scroll-zone">
                {categoryChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] font-bold">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="text-zinc-500 truncate">{item.name}</span>
                    </div>
                    <span className="text-black font-mono pl-1">PKR {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Ledger Table */}
      <div className="bg-white border border-zinc-200 rounded-[24px] overflow-hidden shadow-xs">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              Recent Logs Table
              <button onClick={() => setSortDirection(p => p === "desc" ? "asc" : "desc")} className="p-1 hover:bg-zinc-100 rounded text-zinc-400 transition cursor-pointer">
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </h3>
            <p className="text-[9px] font-bold text-zinc-400 font-mono">Realtime account output</p>
          </div>
          
          <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-xl">
            {["All", "Food", "Utilities", "Entertainment"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition ${activeCategory === cat ? "bg-black text-white shadow-xs" : "text-zinc-600 hover:text-black"}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5 divide-y divide-zinc-100 max-h-[300px] overflow-y-auto ledger-scroll-zone">
          {processedExpenses.length === 0 ? (
            <div className="py-12 text-center max-w-sm mx-auto space-y-3">
              <p className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-wider">No matching records found in local scope</p>
              <button onClick={onTriggerOpenForm} className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer">
                Create Initial Posting
              </button>
            </div>
          ) : (
            processedExpenses.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xs flex-shrink-0">
                    {item.title.substring(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-black tracking-tight truncate">{item.title}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-xs font-black text-black block">PKR {item.amount}</span>
                    <span className="text-[9px] font-bold text-zinc-400 block font-mono">{item.category}</span>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}