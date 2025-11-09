import { useState } from "react";
import {MdPayments} from 'react-icons/md';

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
    <div className="flex flex-col h-full p-0.5">
      <form
        onSubmit={submit}
        className="w-full h-full flex flex-col max-w-4xl bg-card rounded-sm px-6 py-4 mx-auto"
      >
         <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <MdPayments className="text-primary" />
                                Payment Form
                            </h2>
        <p className="text-sm text-slate-500 mt-1">Share Your Payments with Society Memebers</p>
        <div className="space-y-6 py-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment Title</label>
          <input
            type="text"
            value={form.formName}
            onChange={(e) => update("formName", e.target.value)}
            placeholder="Enter The Payment Title"
            required
            className="w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition"/>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => update("issueDate", e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="space-y-6 py-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Pay</label>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            placeholder="Enter the Description"
            onChange={(e) => update("description", e.target.value)}
            required
            className="w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition"
          />
        </div>

        <button
          type="button"
          className="p-1 hover:bg-slate-200 rounded-sm"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
