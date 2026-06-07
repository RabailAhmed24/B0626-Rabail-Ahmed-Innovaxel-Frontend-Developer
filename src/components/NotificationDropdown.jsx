import React, { useMemo, useRef, useEffect } from "react";
import { AlertTriangle, Info, Calendar } from "lucide-react";

export default function NotificationDropdown({ expenses, budgets, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const notifications = useMemo(() => {
    const list = [];
    
    // 1. Log Volume Summary Message Milestone
    if (expenses.length > 0) {
      list.push({
        id: "summary",
        type: "info",
        icon: <Info className="w-3.5 h-3.5 text-zinc-500" />,
        text: `Activity verified: You have logged ${expenses.length} transaction entries within this profile context.`
      });
    }

    // 2. Budget Alert Threshold Checker Loops
    const counts = {};
    expenses.forEach(e => counts[e.category] = (counts[e.category] || 0) + e.amount);
    
    Object.keys(budgets).forEach(cat => {
      const currentSpent = counts[cat] || 0;
      const limit = budgets[cat];
      const pct = (currentSpent / limit) * 100;

      if (pct >= 90) {
        list.push({
          id: `alert-${cat}`,
          type: "danger",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
          text: `Critical Alert: ${cat} metrics have reached PKR ${currentSpent.toLocaleString()} (${pct.toFixed(0)}% of limit).`
        });
      } else if (pct >= 70) {
        list.push({
          id: `warn-${cat}`,
          type: "warning",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
          text: `Warning: ${cat} metrics are climbing at PKR ${currentSpent.toLocaleString()} (${pct.toFixed(0)}% of limit).`
        });
      }
    });

    // 3. Last Log Entry Tracking Node
    if (expenses.length > 0) {
      const latest = expenses[0];
      list.push({
        id: "latest-log",
        type: "log",
        icon: <Calendar className="w-3.5 h-3.5 text-blue-500" />,
        text: `Recent posting: "${latest.title}" - PKR ${latest.amount.toLocaleString()} was mapped successfully.`
      });
    }

    return list;
  }, [expenses, budgets]);

  return (
    <div ref={containerRef} className="absolute right-0 top-12 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="px-4 py-1.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
        <span className="text-[10px] font-black uppercase tracking-wider text-black font-mono">Notifications Engine</span>
        <span className="text-[9px] font-bold text-zinc-400 font-mono">{notifications.length} Logs</span>
      </div>
      
      <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50 ledger-scroll-zone">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            All system vectors nominal
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3.5 flex gap-3 items-start hover:bg-zinc-50 transition">
              <div className="mt-0.5 flex-shrink-0">{n.icon}</div>
              <p className="text-[11px] font-medium text-zinc-700 leading-normal">{n.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
