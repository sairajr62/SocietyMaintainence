import { useState } from "react";

export default function PaymentHandler() {
  const [payments] = useState([
    { id: 1, payer: "John", amount: 240, status: "pending" },
    { id: 2, payer: "Alex", amount: 520, status: "done" },
    { id: 3, payer: "Sara", amount: 180, status: "pending" },
    { id: 4, payer: "David", amount: 900, status: "done" },
  ]);

  const pending = payments.filter((p) => p.status === "pending");
  const done = payments.filter((p) => p.status === "done");

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-semibold">Payment Handler</h1>

      {/* Pending Payments */}
      <div className="rounded-2xl border p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Payer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id} className="border-b last:border-none">
                <td className="p-2">{p.payer}</td>
                <td className="p-2 font-semibold">${p.amount}</td>
                <td className="p-2 text-yellow-600 font-medium">Pending</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Done Payments */}
      <div className="rounded-2xl border p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Completed Payments</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Payer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {done.map((p) => (
              <tr key={p.id} className="border-b last:border-none">
                <td className="p-2">{p.payer}</td>
                <td className="p-2 font-semibold">${p.amount}</td>
                <td className="p-2 text-green-600 font-medium">Done</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}