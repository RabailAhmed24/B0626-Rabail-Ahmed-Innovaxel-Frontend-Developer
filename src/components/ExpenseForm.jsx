import React, { useState, useEffect } from "react";

// 🛠️ FIX 1: Component named correctly to match export and App.jsx props
const ExpenseForm = ({ isOpen, onClose, onSave, expenseToEdit }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  // Pre-fill form if editing an existing expense
  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title || "");
      setAmount(expenseToEdit.amount || "");
      setCategory(expenseToEdit.category || "Food");
      setDate(expenseToEdit.date || "");
    } else {
      // Reset form fields if opening fresh
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate("");
    }
  }, [expenseToEdit, isOpen]);

  // 🛠️ FIX 2: Your exact mapping for parsing safety and anti-crash tracking
  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      id: expenseToEdit ? expenseToEdit.id : Date.now().toString(),
      title: title.trim(),
      amount: parseFloat(amount) || 0, // <--- Anti-crash absolute tracking fix
      category: category,
      date: date || new Date().toISOString().split('T')[0]
    };
    
    // Save data via App.jsx handlers
    onSave(expenseData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight text-zinc-900">
            {expenseToEdit ? "Edit Expense Entry" : "Log New Expense"}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 font-mono">Transaction Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Grocery Shopping, Uber ride"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black focus:bg-white shadow-sm transition"
            />
          </div>

          {/* Amount Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 font-mono">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black focus:bg-white shadow-sm transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 font-mono">Category Allocation</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black focus:bg-white shadow-sm transition appearance-none cursor-pointer"
            >
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
            </select>
          </div>

          {/* Date Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 font-mono">Transaction Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black focus:bg-white shadow-sm transition cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-500 hover:text-black hover:bg-zinc-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              {expenseToEdit ? "Save Changes" : "Confirm Entry"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// 🛠️ FIX 3: Clean, matching export reference
export default ExpenseForm;