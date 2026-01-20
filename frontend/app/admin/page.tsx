'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { apiFetch } from '@/lib/utils/api';

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
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchStats();
        }
    }, [user, authLoading]);

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

    if (authLoading || loading) return <div className="p-20 text-center">Loading...</div>;
    if (user?.role !== 'admin') return <div className="p-20 text-center text-red-600">Unauthorized</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2">Welcome back, {user.name}. Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Revenue', value: `$${data?.stats.totalSales.toFixed(2)}`, icon: '💰', color: 'bg-green-50 text-green-600' },
                        { label: 'Orders', value: data?.stats.orderCount, icon: '📦', color: 'bg-blue-50 text-blue-600' },
                        { label: 'Products', value: data?.stats.productCount, icon: '📱', color: 'bg-purple-50 text-purple-600' },
                        { label: 'Users', value: data?.stats.userCount, icon: '👥', color: 'bg-orange-50 text-orange-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                            <Link href="/admin/orders" className="text-purple-600 font-bold hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 font-bold text-gray-600 text-xs uppercase">Order #</th>
                                        <th className="px-8 py-4 font-bold text-gray-600 text-xs uppercase">Customer</th>
                                        <th className="px-8 py-4 font-bold text-gray-600 text-xs uppercase">Amount</th>
                                        <th className="px-8 py-4 font-bold text-gray-600 text-xs uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data?.recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/20">
                                            <td className="px-8 py-4 font-mono font-bold text-gray-900">{order.orderNumber}</td>
                                            <td className="px-8 py-4 text-gray-600">{order.user?.name || 'Guest'}</td>
                                            <td className="px-8 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                                            <td className="px-8 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-600' :
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

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/admin/products/new" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50 transition border border-gray-100 group">
                                    <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:bg-purple-600 group-hover:text-white transition">➕</span>
                                    <span className="font-bold text-gray-700">Add New Product</span>
                                </Link>
                                <Link href="/admin/categories" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition border border-gray-100 group">
                                    <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition">📂</span>
                                    <span className="font-bold text-gray-700">Manage Categories</span>
                                </Link>
                                <Link href="/admin/coupons" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-orange-50 transition border border-gray-100 group">
                                    <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl group-hover:bg-orange-600 group-hover:text-white transition">🎫</span>
                                    <span className="font-bold text-gray-700">Create Coupon</span>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
                            <h3 className="text-xl font-bold mb-2">Need Support?</h3>
                            <p className="opacity-80 text-sm mb-6">Our administrative support team is available 24/7 to help with technical issues.</p>
                            <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-black hover:bg-gray-100 transition">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
