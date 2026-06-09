// Ensure your handle submit maps data exactly like this to maintain parsing safety:
const handleSubmit = (e) => {
  e.preventDefault();
  const expenseData = {
    id: editingExpense ? editingExpense.id : Date.now().toString(),
    title: title.trim(),
    amount: parseFloat(amount) || 0, // <--- Anti-crash absolute tracking fix
    category: category,
    date: date || new Date().toISOString().split('T')[0]
  };
  
  if(editingExpense) {
    onUpdateExpense(expenseData);
  } else {
    onAddExpense(expenseData);
  }
};