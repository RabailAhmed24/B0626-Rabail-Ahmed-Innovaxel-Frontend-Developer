import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense, onClose }) {
  const [formData, setFormData] = useState({ 
    title: "", 
    amount: "", 
    category: "Food", 
    date: "",
    notes: "" 
  });

  // Confirmed: This hook pre-fills existing data instantly when editingExpense changes
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
      setFormData({ title: "", amount: "", category: "Food", date: "", notes: "" });
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || parseFloat(formData.amount) <= 0) return;

    const payload = {
      id: editingExpense ? editingExpense.id : crypto.randomUUID(),
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes.trim()
    };

    if (editingExpense) onUpdateExpense(payload);
    else onAddExpense(payload);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl relative">
      <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition cursor-pointer">
        <X className="w-4 h-4" />
      </button>

      <div className="mb-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-black">
          {editingExpense ? "Modify Asset Record" : "Add Expense"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 font-mono">Title</label>
          <input
            type="text"
            placeholder="e.g., Grocery run"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-zinc-50 text-xs font-semibold px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 font-mono">Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-zinc-400 font-mono select-none">PKR</span>
              <input
                type="number"
                placeholder="2200"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-zinc-50 text-xs font-black pl-12 pr-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 font-mono">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-zinc-50 text-xs font-bold px-3 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition cursor-pointer"
            >
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 font-mono">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-zinc-50 text-xs font-semibold px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 font-mono">Notes (Optional)</label>
          <textarea
            placeholder="Any extra details..."
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-zinc-50 text-xs font-semibold px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-black focus:bg-white resize-none transition"
          />
        </div>

        <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition shadow-xs cursor-pointer">
          Save Expense
        </button>
      </form>
    </div>
  );
}