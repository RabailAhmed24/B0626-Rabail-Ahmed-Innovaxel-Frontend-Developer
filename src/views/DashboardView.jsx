import React, { useState, useMemo } from "react";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseList from "../components/ExpenseList";
import QuickActionsCard from "../components/QuickActionsCard";
import BudgetHealthCard from "../components/BudgetHealthCard";

/**
 * DashboardView Component
 * Renders the primary financial dashboard workspace containing expense summaries,
 * structured transactional data logs, monthly filtering, and action utilities.
 */
export default function DashboardView({ 
  expenses, 
  budgets, 
  onEditSelect, 
  onDeleteExpense, 
  onTriggerOpenForm, 
  onClearData 
}) {
  // State management for transaction filtering by month (YYYY-MM format)
  const [monthFilter, setMonthFilter] = useState("");

  // Memoized computations to isolate filtered logs and prevent redundant evaluations
  const filteredExpenses = useMemo(() => {
    if (!monthFilter) return expenses;
    return expenses.filter(e => e.date.startsWith(monthFilter));
  }, [expenses, monthFilter]);

  return (
    <div className="space-y-6">
      {/* Financial analytical header component displaying generalized metrics */}
      <ExpenseSummary expenses={filteredExpenses} />

      {/* Structured core dashboard grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Workspace: Chronological Logs and Main Operations */}
        <div className="lg:col-span-8">
          <ExpenseList 
            expenses={filteredExpenses} 
            onEditSelect={onEditSelect}
            onDeleteExpense={onDeleteExpense}
            onTriggerOpenForm={onTriggerOpenForm}
          />
        </div>

        {/* Right Column Workspace: Functional Utilities and Analytical Metrics */}
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