'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/utils/api';
import Link from 'next/link';

interface DashboardStats {
    stats: {
        totalSales: number;
        orderCount: number;
        productCount: number;
        userCount: number;
    };
    recentOrders: Array<{
        _id: string;
        orderNumber: string;
        total: number;
        orderStatus: string;
        user: { name: string };
    }>;
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiFetch('/admin/dashboard');
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Revenue', value: `$${data?.stats.totalSales.toFixed(2) || 0}`, icon: '💰', color: 'bg-green-100 text-green-600' },
                    { label: 'Orders', value: data?.stats.orderCount || 0, icon: '📦', color: 'bg-blue-100 text-blue-600' },
                    { label: 'Products', value: data?.stats.productCount || 0, icon: '📱', color: 'bg-purple-100 text-purple-600' },
                    { label: 'Users', value: data?.stats.userCount || 0, icon: '👥', color: 'bg-orange-100 text-orange-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-500 uppercase">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-purple-600 font-medium hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data?.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-sm">{order.user?.name || 'Guest'}</td>
                                    <td className="px-6 py-4 font-medium text-sm">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            order.orderStatus === 'completed' ? 'bg-green-100 text-green-600' :
                                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
