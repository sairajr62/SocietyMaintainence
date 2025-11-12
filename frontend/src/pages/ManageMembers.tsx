import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext'

type Member = {
    _id: string;
    name: string;
    phone: string;
    email: string;
    flat: string;
};


const ManageMembers: React.FC = () => {
    const {user} = useAuth()
    const managerId = user?.id
    const [members, setMembers] = useState<Member[] | []>([]);

    useEffect(() => {
        if (!managerId) return;
        const getAllSocietyMembers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/society/${managerId}`)
                if (response.status === 200) {
                    console.log(response)
                    setMembers(response.data.members)
                } else {
                    setMembers([])
                    alert('Members Not Found')
                }
            } catch (error) {
                console.log('Error fetching Society Members: ', error)
            }
        }

        getAllSocietyMembers();
    }, [])

    return (
        <div className="flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Members</h1>
                    <p className="text-sm text-slate-500">View and manage all society residents</p>
                </div>
                <div>
                    <span className='bg-primary py-2 px-3 text-sm text-card rounded'>Total Members: {members.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-auto flex-1">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="text-left p-4 text-sm font-semibold text-slate-900">Member</th>
                            <th className="text-left p-4 text-sm font-semibold text-slate-900">Contact</th>
                            <th className="text-left p-4 text-sm font-semibold text-slate-900">Flat No.</th>
                            <th className="text-right p-4 text-sm font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {members.map((member) => (
                            <tr key={member._id} className="hover:bg-slate-50/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <FaUser className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{member.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-900">{member.phone}</div>
                                    <div className="text-xs text-slate-500">{member.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-slate-900">{member.flat}</div>
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button

                                            className="p-1 hover:bg-slate-100 rounded-sm"
                                            title="Edit member"
                                        >
                                            <FaEdit className="w-4 h-4 text-slate-600" />
                                        </button>
                                        <button

                                            className="p-1 hover:bg-red-50 rounded-sm"
                                            title="Delete member"
                                        >
                                            <FaTrash className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {members.length === 0 && (
                    <div className="text-center py-12">
                        <FaUser className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No members found</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMembers;
