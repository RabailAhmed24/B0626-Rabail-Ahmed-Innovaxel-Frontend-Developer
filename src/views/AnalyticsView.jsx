import React, { useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * AnalyticsView Component
 */
export default function AnalyticsView({ expenses }) {
  const aggregateMetrics = useMemo(() => {
    const daily = {};
    const categories = {};
    
    expenses.forEach(e => {
      daily[e.date] = (daily[e.date] || 0) + e.amount;
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const graphTimeline = Object.keys(daily).sort((a,b) => new Date(a) - new Date(b)).map(date => ({
      date: new Date(date).toLocaleDateString("en-US", { day: 'numeric', month: 'short' }),
      Amount: daily[date]
    }));

    const categoryBreakdown = Object.keys(categories).map(cat => ({
      Category: cat,
      Total: categories[cat]
    })).sort((a,b) => b.Total - a.Total);

    return { graphTimeline, categoryBreakdown };
  }, [expenses]);

  return (
    <div className="space-y-6 w-full">
      
      {/* Spending Trend */}
      <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs w-full">
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">Spending Trend</h3>
          <p className="text-[9px] font-bold text-zinc-400 font-mono">Historical volume analysis of outward expenditure</p>
        </div>
        <div className="w-full h-64">
          {aggregateMetrics.graphTimeline.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/50 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              No historical data tracked yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggregateMetrics.graphTimeline}>
                <defs>
                  <linearGradient id="analyticsGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `PKR ${v}`} tick={{ fill: "#71717a", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", color: "#fff", border: "none", borderRadius: "12px", fontSize: "11px" }} />
                <Area type="monotone" dataKey="Amount" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Category Breakdown */}
        <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs w-full">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Category Breakdown</h3>
            <p className="text-[9px] font-bold text-zinc-400 font-mono">Structural bar distribution parameters</p>
          </div>
          <div className="w-full h-48">
            {aggregateMetrics.categoryBreakdown.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/50 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                No categorical fields logged
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregateMetrics.categoryBreakdown}>
                  <XAxis dataKey="Category" tick={{ fill: "#71717a", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", color: "#fff", border: "none", borderRadius: "12px", fontSize: "11px" }} />
                  <Bar dataKey="Total" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* UPDATED: Top Categories Card - Solid Red */}
        <div className="bg-[#E53E3E] border border-red-400 rounded-[24px] p-6 shadow-lg space-y-4 w-full">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Top Categories</h3>
            <p className="text-[9px] font-bold text-red-100 font-mono">Primary account distribution vectors</p>
          </div>
          <div className="space-y-3 pt-1 w-full">
            {aggregateMetrics.categoryBreakdown.slice(0, 3).map((item, idx) => (
              <div key={item.Category} className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/10 w-full">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-black text-red-100">0{idx + 1}</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wide">{item.Category}</span>
                </div>
                <span className="text-xs font-black text-white font-mono">PKR {item.Total.toLocaleString()}</span>
              </div>
            ))}
            {aggregateMetrics.categoryBreakdown.length === 0 && (
              <p className="text-center py-10 text-[10px] font-bold text-red-100 uppercase tracking-wider">Ledger stack empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}