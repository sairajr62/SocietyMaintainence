import axios from 'axios';
import React, { useState } from 'react';
import { FaBuilding } from 'react-icons/fa';

type FormState = {
    // Society Details
    societyName: string;
    address: string;
    city: string;
    pinCode: string;
    state: string;
    // Manager Credentials
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    managerPassword: string;
};

const defaultState: FormState = {
    societyName: '',
    address: '',
    city: '',
    pinCode: '',
    state: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    managerPassword: ''
};

const AddSocietyForm: React.FC = () => {
    const [form, setForm] = useState<FormState>(defaultState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const err: Record<string, string> = {};
        // Society validations
        if (!form.societyName.trim()) err.societyName = 'Society name is required';
        if (!form.address.trim()) err.address = 'Address is required';
        if (!form.city.trim()) err.city = 'City is required';
        if (!form.pinCode.trim()) err.pinCode = 'pinCode is required';
        else if (!/^\d{6}$/.test(form.pinCode)) err.pinCode = 'Enter valid 6-digit pinCode';

        if (!form.state.trim()) err.state = 'State is required';

        // Manager validations
        if (!form.managerName.trim()) err.managerName = 'Manager name is required';
        if (!form.managerPhone.trim()) err.managerPhone = 'Phone is required';
        else if (!/^\d{10}$/.test(form.managerPhone)) err.managerPhone = 'Enter valid 10-digit phone';
        if (!form.managerEmail) err.managerEmail = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.managerEmail)) err.managerEmail = 'Enter valid email';
        if (!form.managerPassword) err.managerPassword = 'Password is required';
        else if (form.managerPassword.length < 6) err.managerPassword = 'Password must be at least 6 characters';

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        if (!validate()) return alert('Please fix the errors in the form before submitting.');
        setSubmitting(true);

        try {
            const response = await axios.post(`${baseUrl}/society/create-society`, form);
            if (response.status === 201) {
                // console.log('Submit society:', form);
                alert(response.data?.message || 'Society and Manager created successfully.');
                setSuccess('Society created successfully. Manager credentials have been set.');
                setForm(defaultState);
            } else {
                alert('Failed to create society. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: 'Failed to create society. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="lg-flex flex-col h-full p-0.5">
            <form onSubmit={handleSubmit} className="w-full h-full flex flex-col space-y-6 max-w-7xl bg-card rounded-sm px-6 py-4">
                {/* Header */}
                <div className="pb-0">
                    <h2 className="text-2xl font-bold text-slate-900">Add New Society</h2>
                    <p className="text-sm text-slate-500 mt-1">Create a new society and set up manager credentials.</p>
                </div>

                {errors.general && <div className="text-xs text-red-600">{errors.general}</div>}
                {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-sm">{success}</div>}

                {/* Society Details Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-t border-slate-200 pt-6">
                        <FaBuilding className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-slate-900">Society Details</h3>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-sm border border-slate-100">
                        <div className="lg:grid grid-cols-2 gap-6 space-y-4 lg:space-y-0">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Society Name</label>
                                <input
                                    name="societyName"
                                    value={form.societyName}
                                    onChange={handleChange}
                                    placeholder="Enter society name"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.societyName ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.societyName && <p className="mt-1 text-xs text-red-600">{errors.societyName}</p>}
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.city ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">PinCode</label>
                                <input
                                    name="pinCode"
                                    value={form.pinCode}
                                    onChange={handleChange}
                                    placeholder="6-digit pinCode"
                                    maxLength={6}
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.pinCode ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.pinCode && <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p>}
                            </div>

                            <div className=''>
                                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="Enter State"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.state ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                            </div>


                            <div className='col-span-2'>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Society address"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.address ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manager Credentials Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-t border-slate-200 pt-6">
                        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-lg font-bold text-slate-900">Manager Credentials</h3>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-sm border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Manager Name</label>
                                <input
                                    name="managerName"
                                    value={form.managerName}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.managerName ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.managerName && <p className="mt-1 text-xs text-red-600">{errors.managerName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <input
                                    name="managerPhone"
                                    value={form.managerPhone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone"
                                    maxLength={10}
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.managerPhone ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.managerPhone && <p className="mt-1 text-xs text-red-600">{errors.managerPhone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    name="managerEmail"
                                    type="email"
                                    value={form.managerEmail}
                                    onChange={handleChange}
                                    placeholder="manager@example.com"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.managerEmail ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.managerEmail && <p className="mt-1 text-xs text-red-600">{errors.managerEmail}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Set Password</label>
                                <input
                                    name="managerPassword"
                                    type="password"
                                    value={form.managerPassword}
                                    onChange={handleChange}
                                    placeholder="Minimum 6 characters"
                                    className={`w-full rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${errors.managerPassword ? 'border-red-300' : 'border-slate-200'}`}
                                />
                                {errors.managerPassword && <p className="mt-1 text-xs text-red-600">{errors.managerPassword}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pb-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm rounded-sm hover:brightness-95 disabled:opacity-70 shadow-sm"
                    >
                        <FaBuilding className="w-4 h-4" />
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                Creating Society...
                            </>
                        ) : (
                            'Create Society'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSocietyForm;
