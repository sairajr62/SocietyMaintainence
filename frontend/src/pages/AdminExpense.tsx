import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function ExpenseTracker() {
  const [expenses] = useState([
    { category: "Food", amount: 320 },
    { category: "Transport", amount: 120 },
    { category: "Shopping", amount: 450 },
    { category: "Bills", amount: 980 },
    { category: "Other", amount: 210 },
  ]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-semibold">Expense Tracker</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border p-6 shadow-sm bg-white">
          <p className="text-gray-500">Total Expenses</p>
          <p className="text-3xl font-semibold mt-2">₹{total}</p>
        </div>

        <div className="rounded-2xl border p-6 shadow-sm bg-white">
          <p className="text-gray-500">Highest Category</p>
          <p className="text-xl font-semibold mt-2">
            {expenses.reduce((a, b) => (a.amount > b.amount ? a : b)).category}
          </p>
        </div>

        <div className="rounded-2xl border p-6 shadow-sm bg-white">
          <p className="text-gray-500">Entries</p>
          <p className="text-3xl font-semibold mt-2">{expenses.length}</p>
        </div>
      </div>

      {/* Graph */}
      <div className="rounded-2xl border p-6 shadow-sm bg-white h-96">
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense List */}
      <div className="rounded-2xl border p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="p-2">{e.category}</td>
                <td className="p-2 font-semibold">₹{e.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
