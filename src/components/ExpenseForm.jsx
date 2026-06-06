import React, { useState, useEffect } from "react";

/**
 * ExpenseForm component renders a unified interface for creation and modification of expense objects.
 * Handles structural field validation dynamically.
 */
export default function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense, setEditingExpense }) {
  // Local structural state mapping all specific required and optional form inputs
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food", // System default category fallback
    date: "",
    notes: ""
  });

  // Effect hooks monitoring external edit context shifts to populate fields instantly
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        date: editingExpense.date,
        notes: editingExpense.notes || ""
      });
    } else {
      resetFormState();
    }
  }, [editingExpense]);

  /**
   * Resets local component form fields back to sterile default baselines.
   */
  const resetFormState = () => {
    setFormData({
      title: "",
      amount: "",
      category: "Food",
      date: "",
      notes: ""
    });
  };

  /**
   * Universal change handler adjusting individual nested properties by DOM name assignments.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Intercepts standard form submission for explicit data schema validation processing.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Secondary validation block matching numerical boundaries and empty text spaces
    if (!formData.title.trim() || !formData.date || parseFloat(formData.amount) <= 0) {
      alert("Please provide valid inputs. Amount must be greater than zero.");
      return;
    }

    const payload = {
      id: editingExpense ? editingExpense.id : crypto.randomUUID(),
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes.trim()
    };

    if (editingExpense) {
      onUpdateExpense(payload);
    } else {
      onAddExpense(payload);
    }

    resetFormState();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          {editingExpense ? "Modify Expense Entry" : "Track New Expense"}
        </h2>
        {editingExpense && (
          <button
            type="button"
            onClick={() => setEditingExpense(null)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Expense Title *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Office Supplies"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Amount & Category Input Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Amount (PKR) *
            </label>
            <input
              type="number"
              name="amount"
              required
              min="0.01"
              step="any"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
              <option value="Medical">Medical</option>
              <option value="Housing">Housing</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
        </div>

        {/* Date Picker Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Transaction Date *
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleInputChange}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Optional Notes Block */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Memo Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows="3"
            placeholder="Add specific contextual details here..."
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
          />
        </div>

        {/* Master Action Trigger Button */}
        <button
          type="submit"
          className="w-full mt-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition duration-150"
        >
          {editingExpense ? "Save Structural Changes" : "Commit Expense Entry"}
        </button>
      </form>
    </div>
  );
}