import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdPayments } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

interface Payments {
  _id: string,
  paymentId: string,
  title: string,
  amount: number,
  dueDate: Date,
  issueDate: Date,
  description: string,
  status: string,
  paidAt: Date,
}

const MyPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payments[] | []>([]);
  const [reloadPayments, setReloadPayments] = useState<boolean>(false)

  useEffect(() => {
    const fetchMemberPayments = async () => {
      const memberId = user?.id
      try {
        const response = await axios.get(`${baseUrl}/payment/member/${memberId}`)
        if (response.status === 200) {
          setPayments(response.data.payments)
        } else {
          alert(response.data.message || "Failed to fetch member payments")
          setPayments([])
        }
      } catch (error) {
        console.log("Error Fetching Member Payments: ", error)
      }
    }
    fetchMemberPayments();
  }, [reloadPayments])

  const pending = payments.filter((p) => p.status === "pending");
  const paid = payments.filter((p) => p.status === "paid");


  const handlePay = async (payment) => {
    try {
      const res = await axios.post(`${baseUrl}/razorpay/create-order`, {
        amount: payment.amount,
        paymentStatusId: payment.id
      })

      const { key, orderId, amount } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        title: payment.title,
        order_id: orderId,
        handler: async (response) => {
          await axios.post(`${baseUrl}/razorpay/verify-payment`, {
            ...response,
            paymentStatusId: payment.id,
            amount: payment.amount,
          });
          alert("Payment Successful!")
          setReloadPayments(true)
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error While Paying on Razorpay: ", error)
      alert("Error While Paying on Razorpay")
    }
  }


  return (
    <div className="flex flex-col h-full py-5 px-6">
      {/* Header */}
      <div className="flex justify-between items-start w-full mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MdPayments className="text-primary w-6 h-6" />
            My Payments
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            View and manage payment statuses of your society.
          </p>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden mb-6">
        <div className="px-5 py-4 border-b bg-card">
          <h3 className="text-lg font-semibold text-slate-800">
            Pending Payments
          </h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border-t text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-2 text-left whitespace-nowrap">Sr. No.</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Title</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Description</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">IssuedDate</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">DueDate</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Amount</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Status</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length > 0 ? (
                pending.map((p, i) => (
                  <tr
                    key={p._id}
                    className={`${i % 2 ? "bg-primary/5" : "bg-white"}`}
                  >
                    <td className="px-3 py-3">{i + 1}.</td>
                    <td className="px-3 py-3 text-nowrap">{p.title}</td>
                    <td className="px-3 py-3 font-medium">{p.description}</td>
                    <td className="px-3 py-3 font-medium">
                      {p?.issueDate ? new Date(p.issueDate).toLocaleDateString("en-IN") : "--"}
                    </td>
                    <td className="px-3 py-3 font-medium">
                      {p?.dueDate ? new Date(p.dueDate).toLocaleDateString("en-IN") : "--"}
                    </td>

                    <td className="px-3 py-3 font-medium">₹{p.amount}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => handlePay(p)}
                        className="bg-green-500 text-card px-2 py-1 rounded">
                        pay now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-slate-500">
                    No pending payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Payments */}
      <div className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b bg-card">
          <h3 className="text-lg font-semibold text-slate-800">
            Completed Payments
          </h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border-t text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-2 text-left whitespace-nowrap">Sr. No.</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Title</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Description</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">IssuedDate</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">DueDate</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Status</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">PaidAt</th>
              </tr>
            </thead>
            <tbody>
              {paid.length > 0 ? (
                paid.map((p, i) => (
                  <tr
                    key={p._id}
                    className={`${i % 2 ? "bg-primary/5" : "bg-white"}`}
                  >
                    <td className="px-3 py-3">{i + 1}.</td>
                    <td className="px-3 py-3 text-nowrap">{p.title}</td>
                    <td className="px-3 py-3 font-medium">{p.description}</td>
                    <td className="px-3 py-3 font-medium">
                      {p?.issueDate ? new Date(p.issueDate).toLocaleDateString("en-IN") : "--"}
                    </td>
                    <td className="px-3 py-3 font-medium">
                      {p?.dueDate ? new Date(p.dueDate).toLocaleDateString("en-IN") : "--"}
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                        {p.status}
                      </span>
                    </td>
                   <td className="px-3 py-3 font-medium">
                      {p?.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : "--"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-slate-500">
                    No completed payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPayments;
