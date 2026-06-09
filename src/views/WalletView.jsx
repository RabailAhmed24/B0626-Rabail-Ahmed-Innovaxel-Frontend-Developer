import React, { useMemo } from "react";
import { CreditCard, ArrowDownRight, Calendar } from "lucide-react";

/**
 * WalletView Component
 */
export default function WalletView({ expenses }) {
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  
  const dynamicBalance = useMemo(() => {
    const baseCapital = 120000;
    return Math.max(baseCapital - totalSpent, 0);
  }, [totalSpent]);

  const recentTenLogs = useMemo(() => {
    return [...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      <div className="lg:col-span-5 space-y-4 w-full">
        {/* Premium Credit Card */}
        <div className="bg-gradient-to-br from-zinc-950 via-neutral-900 to-red-950/40 border border-zinc-850 text-white p-6 rounded-[24px] shadow-xl relative w-full aspect-[1.586/1] flex flex-col justify-between overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/20 transition-all duration-500" />
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 font-mono">Available Balance</p>
              <h4 className="text-xl font-black mt-1 tracking-tight text-white">PKR {dynamicBalance.toLocaleString()}</h4>
            </div>
            <CreditCard className="w-5 h-5 text-red-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            <p className="text-base font-mono tracking-widest text-zinc-300 font-bold">
              •••• &nbsp; •••• &nbsp; •••• &nbsp; 4291
            </p>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Card Holder</p>
                <p className="text-xs font-bold text-white tracking-tight">Rabail Ahmed</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Expires</p>
                <p className="text-xs font-bold text-white font-mono">08 / 31</p>
              </div>
            </div>
          </div>
        </div>

        {/* UPDATED: Total Outflows Metric Tracker Card (Solid Red) */}
        <div className="bg-[#E53E3E] rounded-[24px] p-5 shadow-lg flex justify-between items-center w-full">
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-red-100 block font-mono">Total Capital Outflows</span>
            <span className="text-base font-black text-white block mt-0.5">PKR {totalSpent.toLocaleString()}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Transaction History Workspace Card */}
      <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-[24px] p-6 shadow-xs space-y-4 w-full">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-black">Wallet Statement</h3>
          <p className="text-[9px] font-bold text-zinc-400 font-mono">Recent historical transaction timeline (Limit 10)</p>
        </div>

        <div className="divide-y divide-zinc-100 max-h-[340px] overflow-y-auto pr-1 zone-scroll">
          {recentTenLogs.length === 0 ? (
            <div className="py-16 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              No recent transactions found
            </div>
          ) : (
            recentTenLogs.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 w-full">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-black truncate tracking-tight">{item.title}</h4>
                    <p className="text-[9px] text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-300" /> {item.date}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-black block">PKR {item.amount.toLocaleString()}</span>
                  <span className="text-[8px] font-bold text-zinc-400 block font-mono uppercase">{item.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}