import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { BiBuilding } from 'react-icons/bi';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Society = {
    _id: string;
    name: string;
    address: string;
    city: string;
    pinCode: string;
    manager: {
        name: string,
        email: string,
        phone: string,
    };
    createdAt: string;
};



const ManageSocieties: React.FC = () => {
    const [societies, setSocieties] = useState<Society[] | []>([]);

    useEffect(() => {
        const getAllsocieties = async () => {
            try {
                const response = await axios.get(`${baseUrl}/society`);
                if (response.status === 200) {
                    setSocieties(response.data.societies)
                } else {
                    setSocieties([])
                }
            } catch (error) {
                console.log("Error fetching Societies: ", error)
            }
        }

        getAllsocieties()
    }, [])

    return (
        <div className="flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Societies</h1>
                    <p className="text-sm text-slate-500">View and manage all registered societies</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-auto flex-1">
                {societies.length !== 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left p-4 text-sm font-semibold text-slate-900">Society</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-900">Location</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-900">Manager</th>
                                <th className="text-right p-4 text-sm font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {societies.map((society) => (
                                <tr key={society._id} className="hover:bg-slate-50/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                                                <BiBuilding className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="capitalize font-medium text-slate-900">{society.name}</div>
                                                <div className="text-xs text-slate-500">ID: {society._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="capitalize text-sm text-slate-900">{society.city}</div>
                                        <div className="text-xs text-slate-500">{society.pinCode}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="capitalize text-sm text-slate-900">{society.manager.name}</div>
                                        <div className="text-xs text-slate-500">{society.manager.phone}</div>
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button

                                                className="p-1 hover:bg-slate-100 rounded-sm"
                                            >
                                                <FaEdit className="w-4 h-4 text-slate-600" />
                                            </button>
                                            <button

                                                className="p-1 hover:bg-red-50 rounded-sm"
                                            >
                                                <FaTrash className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <BiBuilding className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900 mb-3">No societies found</h3>

                        <div>
                            <Link
                                to={'/add-society'}
                                className='bg-primary text-card px-6 py-2 rounded'
                            >
                                Add a Society
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSocieties;
