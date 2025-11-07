import { useState } from "react";

export default function PaymentForm() {
  const [form, setForm] = useState({
    formName: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    description: "",
  });

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex justify-center py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-6 rounded-2xl border p-6 shadow-sm bg-white"
      >
        <h1 className="text-center text-2xl font-semibold">Payment Form</h1>

        <div className="space-y-1">
          <label className="font-medium">Form Name</label>
          <input
            type="text"
            value={form.formName}
            onChange={(e) => update("formName", e.target.value)}
            placeholder="Enter The Form Name"
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Issue Date</label>
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => update("issueDate", e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Amount to Pay</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            placeholder="Enter the Amount to Pay"
            onChange={(e) => update("amount", e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium">Description</label>
          <textarea
            value={form.description}
            placeholder="Enter the Description"
            onChange={(e) => update("description", e.target.value)}
            required
            className="w-full rounded-xl border p-3 h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl border bg-gray-100 py-3 font-medium hover:bg-gray-200"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
