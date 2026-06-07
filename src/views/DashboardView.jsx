import React, { useState, useMemo } from "react";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseList from "../components/ExpenseList";
import QuickActionsCard from "../components/QuickActionsCard";
import BudgetHealthCard from "../components/BudgetHealthCard";

export default function DashboardView({ expenses, budgets, onEditSelect, onDeleteExpense, onTriggerOpenForm, onClearData }) {
  const [monthFilter, setMonthFilter] = useState("");

  const filteredExpenses = useMemo(() => {
    if (!monthFilter) return expenses;
    return expenses.filter(e => e.date.startsWith(monthFilter));
  }, [expenses, monthFilter]);

  return (
    <div className="space-y-6">
      <ExpenseSummary expenses={filteredExpenses} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <ExpenseList 
            expenses={filteredExpenses} 
            onEditSelect={onEditSelect}
            onDeleteExpense={onDeleteExpense}
            onTriggerOpenForm={onTriggerOpenForm}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <QuickActionsCard 
            onTriggerOpenForm={onTriggerOpenForm} 
            expenses={expenses}
            onClearAll={onClearData}
            onFilterMonth={setMonthFilter}
          />
          <BudgetHealthCard expenses={expenses} budgets={budgets} />
        </div>
      </div>
    </div>
  );
}
