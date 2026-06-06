import React, { useState, useMemo } from "react";
import { Edit2, Trash2, Calendar, Tag, SlidersHorizontal } from "lucide-react";

/**
 * ExpenseList component renders a data grid and card log representing tracked transactions.
 * Features built-in structural multi-parameter filtering and automated date sorting.
 */
export default function ExpenseList({ expenses, onEditSelect, onDeleteExpense }) {
  // Local state tracking for search filter criteria
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /**
   * Resets all search filters back to default values.
   */
  const handleClearFilters = () => {
    setSelectedCategory("All");
    setStartDate("");
    setEndDate("");
  };

  /**
   * Evaluates active filtering parameters and automatically sorts values by date.
   * Utilizes memoization to avoid redundant sorting on unrelated re-renders.
   */
  const processedExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Filter condition: Category match
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter condition: Start Date boundary
    if (startDate) {
      filtered = filtered.filter((item) => item.date >= startDate);
    }

    // Filter condition: End Date boundary
    if (endDate) {
      filtered = filtered.filter((item) => item.date <= endDate);
    }

    // Absolute structural requirement: Most recent transactions first
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, selectedCategory, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Control Panel: Filters & Parameters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center space-x-2 text-gray-900 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Filter Controls
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
              <option value="Medical">Medical</option>
              <option value="Housing">Housing</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          {/* Start Date Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* End Date Selection */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Clear Filter Condition Trigger */}
        {(selectedCategory !== "All" || startDate || endDate) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-red-500 hover:text-red-700 dynamic-transition"
            >
              Clear Active Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Expense Ledger Render Block */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {processedExpenses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm text-gray-500 font-medium">No matching transactions logged.</p>
          </div>
        ) : (
          <>
            {/* Desktop View Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200">
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Details</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Amount</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {processedExpenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                        {item.notes && <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{item.notes}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-sm text-gray-900">
                        PKR {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => onEditSelect(item)}
                            className="text-gray-500 hover:text-indigo-600 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(item.id)}
                            className="text-gray-500 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card Layout */}
            <div className="md:hidden divide-y divide-gray-100">
              {processedExpenses.map((item) => (
                <div key={item.id} className="p-4 space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      PKR {item.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex space-x-2 text-xs text-gray-500 font-medium">
                      <span className="flex items-center px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                        <Tag className="w-3 h-3 mr-1 text-gray-400" />
                        {item.category}
                      </span>
                      <span className="flex items-center px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {item.date}
                      </span>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => onEditSelect(item)}
                        className="text-gray-500 hover:text-indigo-600 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="text-gray-500 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}