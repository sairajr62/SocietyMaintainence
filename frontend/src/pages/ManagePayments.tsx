import React, { useEffect, useState } from "react";
import { MdPayments } from "react-icons/md";
import { FaCaretDown, FaCaretUp, FaChevronDown, FaChevronUp, FaEnvelope, FaPhone } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface PaidMembers {
    id: string;
    status: string;
    amountPaid: number;
    paidAt: Date;
    payerName: string;
    payerEmail: string;
    payerPhone: string;
    payerFlat: string;
}

interface Payments {
    _id: string;
    title: string;
    amount: number;
    description: string;
    issueDate: Date;
    dueDate: Date;
}



const ManagePayments = () => {
    const { user } = useAuth();

    const [payments, setPayments] = useState<Payments[] | []>([])
    const [paidMembers, setPaidMembers] = useState<PaidMembers[] | []>([])

    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    useEffect(() => {
        const fetchAllManagerCreatedPayments = async () => {
            try {
                const res = await axios.get(`${baseUrl}/payment/manager/${user?.id}`)
                if (res.status === 200) {
                    setPayments(res.data.payments)
                } else {
                    setPayments([])
                }
            } catch (error) {
                console.log("Error Fetching Manager Created payments: ", error)
            }
        };

        fetchAllManagerCreatedPayments();
    }, [])

    const getAllPaidMembers = async (paymentId: string) => {
        try {
            const res = await axios.get(`${baseUrl}/payment/manager/paid-members/${paymentId}`);
            if (res.status === 200) {
                setPaidMembers(res.data.paidMembers)
            } else {
                setPaidMembers([])
            }
        } catch (error) {
            console.log("Error Fetching Paid Members: ", error)
        }
    }

    return (
        <div className="flex flex-col h-full py-5 px-6">
            {/* Header */}
            <div className="flex justify-between items-start w-full mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MdPayments className="text-primary w-6 h-6" />
                        Manage Payments
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        View and manage payment details of your society.
                    </p>
                </div>
            </div>

            {/* Payments List */}
            <div className="space-y-4">
                {payments.map((payment) => (
                    <div
                        key={payment._id}
                        className="border border-slate-200 rounded shadow-sm bg-white overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-center px-5 py-4 cursor-pointer transition"
                            onClick={() => {
                                toggleExpand(payment._id)
                                getAllPaidMembers(payment._id)
                            }}
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {payment.title}
                                </h3>
                                <p className="text-sm text-slate-500">{payment.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                                    <span>Amount: ₹{payment.amount}</span>
                                    <span>Issue: {new Date(payment.issueDate).toLocaleDateString()}</span>
                                    <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button className="text-slate-600 hover:text-slate-900 transition-all">
                                {expanded === payment._id ? (
                                    <FaCaretUp className="w-6 h-6 flex-shrink-0 text-primary" />
                                ) : (
                                    <FaCaretDown className="w-6 h-6 flex-shrink-0 text-primary" />
                                )}
                            </button>
                        </div>

                        {/* Expandable Section */}
                        <div
                            className={`transition-all duration-300 overflow-hidden ${expanded === payment._id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="bg-card border-t border-slate-200 ">
                                {/* <h4 className="text-slate-700 font-medium mb-2">Member Details</h4> */}
                                <div className="overflow-x-auto w-full max-h-64">
                                    <table className="min-w-full bg-card border border-t-0 text-sm">
                                        <thead className="sticky top-0 bg-primary text-card">
                                            <tr className="">
                                                <th className="px-3 py-2 text-left whitespace-nowrap">Sr. No.</th>
                                                <th className="px-3 py-2 text-left whitespace-nowrap">PayerName</th>
                                                <th className="px-3 py-2 text-left whitespace-nowrap">Contact</th>
                                                <th className="px-3 py-2 text-left whitespace-nowrap">Flat No.</th>
                                                <th className="px-3 py-2 text-left whitespace-nowrap">Status</th>
                                                <th className="px-3 py-2 text-left whitespace-nowrap">Amount Paid</th>
                                                <th className="px-3 py-2 text-left whitespace-nowrap">PaidAt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paidMembers.map((m, i) => (
                                                <tr key={m.id} className={`${i % 2 ? 'bg-primary/5' : 'bg-card'}`}>
                                                    <td className="px-3 py-3">{i + 1}.</td>
                                                    <td className="px-3 py-3 text-nowrap text-sm">{m.payerName}</td>
                                                    <td className="px-3 py-3 text-nowrap text-sm">
                                                        <p className="flex items-center"><FaPhone className="mr-2" />{m.payerPhone}</p>
                                                        <p className="flex items-center"><FaEnvelope className="mr-2" />{m.payerEmail}</p>
                                                    </td>
                                                    <td className="px-3 py-3">{m.payerFlat}</td>
                                                    <td className="px-3 py-3">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${m.status === "paid"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {m.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {m.amountPaid ? <p>₹{m.amountPaid}</p> : '--'}
                                                    </td>
                                                    <td className="px-3 py-3 font-medium">
                                                        {m.paidAt ? new Date(m.paidAt).toLocaleDateString("en-IN") : "--"}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {payments.length === 0 &&
                <div className="flex w-full justify-center items-start">
                    No payments created by you
                </div>
            }
        </div>
    );
};

export default ManagePayments;
