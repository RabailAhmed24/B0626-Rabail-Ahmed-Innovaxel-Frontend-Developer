import React, { useMemo } from "react";
import { TrendingUp, CreditCard, Receipt } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ExpenseSummary({ expenses, loading = false }) {
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);

  const currentMonthSpent = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return expenses
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
      })
      .reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Total Spending Metric Block */}
      <div className="premium-notebook-card p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Total Balance Out</p>
          <h3 className="text-2xl font-black tracking-tight text-black">
            {loading ? <Skeleton width={120} /> : `PKR ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-black">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      {/* Budget Dynamic Metric Block */}
      <div className="premium-notebook-card p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Monthly Telemetry</p>
          <h3 className="text-2xl font-black tracking-tight text-black">
            {loading ? <Skeleton width={120} /> : `PKR ${currentMonthSpent.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#ef4444]">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Analytics Quantified Item Node Count */}
      <div className="premium-notebook-card p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Active Postings</p>
          <h3 className="text-2xl font-black tracking-tight text-black">
            {loading ? <Skeleton width={80} /> : <>{expenses.length} <span className="text-xs font-medium text-zinc-400 font-sans">Entries</span></>}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
          <Receipt className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}