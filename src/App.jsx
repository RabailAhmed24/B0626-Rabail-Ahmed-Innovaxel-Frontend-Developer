import React from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [expenses, setExpenses] = useLocalStorage("personal-expenses", []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">
          Personal Expense Tracker
        </h1>
        <p className="text-gray-500">
          Total items logged right now: <span className="font-bold text-gray-800">{expenses.length}</span>
        </p>
      </div>
    </div>
  );
}

export default App;