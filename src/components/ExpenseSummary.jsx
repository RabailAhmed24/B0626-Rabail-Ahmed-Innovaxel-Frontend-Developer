import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Wallet } from "lucide-react";

/**
 * ExpenseSummary component calculates the global financial metrics from the aggregate dataset.
 * Renders an optimized data visualization chart mapping category breakdowns.
 */
export default function ExpenseSummary({ expenses }) {
  
  /**
   * Computes the mathematical sum total of all tracked transaction objects.
   */
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  /**
   * Processes the raw expense logs into an aggregated data array structured for Recharts consumption.
   */
  const chartData = useMemo(() => {
    const categories = {
      Food: 0,
      Utilities: 0,
      Entertainment: 0,
      Transport: 0,
      Medical: 0,
      Housing: 0,
      Miscellaneous: 0
    };

    // Distribute transaction totals across distinct category slots
    expenses.forEach((item) => {
      if (categories[item.category] !== undefined) {
        categories[item.category] += item.amount;
      } else {
        categories["Miscellaneous"] += item.amount;
      }
    });

    // Transform structural map into flat array format required by charting configurations
    return Object.keys(categories)
      .map((key) => ({
        category: key,
        amount: categories[key]
      }))
      .filter((item) => item.amount > 0); // Only pass categories that contain numerical weights
  }, [expenses]);

  // Unified color palette mapped natively across data points
  const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#64748b"];

  return (
    <div className="space-y-6">
      {/* Structural Card: Total Amount Metrics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
          <Wallet className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total Expenditures
          </p>
          <h3 className="text-2xl font-black text-gray-900 mt-0.5">
            PKR {totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Structural Card: Analytical Data Visualization Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-6">
          Category Allocation Breakdown
        </h3>

        {chartData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400 font-medium">
              Awaiting data telemetry to populate metrics.
            </p>
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    borderRadius: "12px", 
                    borderColor: "#e5e7eb",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
                  }}
                  formatter={(value) => [`PKR ${value.toLocaleString()}`, "Spent"]}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}