import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, DollarSign, Wrench, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FaRupeeSign } from 'react-icons/fa';

export default function AdminMaintenanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const maintenanceStats = {
    pending: 3,
    completed: 24,
    inProgress: 2,
    monthlyBudget: 50000,
    spent: 32500
  };

  const maintenanceHistory = [
    { month: 'Aug', complaints: 12, resolved: 10 },
    { month: 'Sep', complaints: 15, resolved: 14 },
    { month: 'Oct', complaints: 8, resolved: 8 },
    { month: 'Nov', complaints: 9, resolved: 7 }
  ];

  const expenseData = [
    { name: 'Plumbing', value: 8500 },
    { name: 'Electrical', value: 6200 },
    { name: 'Painting', value: 5800 },
    { name: 'Cleaning', value: 4000 },
    { name: 'Others', value: 8000 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const recentMaintenance = [
    { id: 1, type: 'Pipe Leak - A Wing', status: 'completed', date: '2025-11-06', amount: '₹2,500' },
    { id: 2, type: 'AC Repair - B Wing', status: 'in-progress', date: '2025-11-05', amount: '₹3,500' },
    { id: 3, type: 'Light Replacement - Common Area', status: 'pending', date: '2025-11-04', amount: '₹800' },
    { id: 4, type: 'Gate Motor Service', status: 'completed', date: '2025-11-03', amount: '₹1,200' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">Complete Maintenance Overview</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-orange-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Issues</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{maintenanceStats.pending}</p>
            </div>
            <AlertCircle className="w-16 h-16 text-orange-500 opacity-15" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{maintenanceStats.inProgress}</p>
            </div>
            <Wrench className="w-16 h-16 text-blue-500 opacity-15" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{maintenanceStats.completed}</p>
            </div>
            <CheckCircle className="w-16 h-16 text-green-500 opacity-15" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Budget Used</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">65%</p>
              <p className="text-xs text-gray-500 mt-2">
                ₹{maintenanceStats.spent.toLocaleString()} / ₹{maintenanceStats.monthlyBudget.toLocaleString()}
              </p>
            </div>
            <FaRupeeSign className="w-16 h-16 text-purple-500 opacity-15" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-semibold text-base transition ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-3 font-semibold text-base transition ${
            activeTab === 'recent'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Maintenance
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
        <div className="grid grid-cols-1  xl:grid-cols-2 gap-8">
          {/* Complaints Trend */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Complaints vs Resolved
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={maintenanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaRupeeSign className="w-6 h-6 text-purple-600" />
              Expense Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
          {/* Monthly Budget */}
          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Budget Status</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-base font-semibold text-gray-700">Total Budget Usage</span>
                  <span className="text-base font-semibold text-gray-900">₹32,500 / ₹50,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <p className="text-base text-gray-600">₹17,500 remaining • 25 days left in November</p>
            </div>
          </div>
          </>
      )}

      {/* Recent Maintenance Tab */}
      {activeTab === 'recent' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-8 py-4 text-left text-base font-semibold text-gray-900">Maintenance Type</th>
                <th className="px-8 py-4 text-left text-base font-semibold text-gray-900">Status</th>
                <th className="px-8 py-4 text-left text-base font-semibold text-gray-900">Date</th>
                <th className="px-8 py-4 text-left text-base font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentMaintenance.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-8 py-5 text-base text-gray-900 font-medium">{item.type}</td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-base text-gray-600">{item.date}</td>
                  <td className="px-8 py-5 text-base font-bold text-gray-900">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
