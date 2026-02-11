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
        createdAt: string;
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
            const data = await apiFetch('/admin/dashboard');
            if (data.success) {
                setData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Revenue', value: `৳${data?.stats.totalSales.toFixed(2) || 0}`, icon: '💰', color: 'bg-green-50 text-green-600 border-green-200' },
                    { label: 'Orders', value: data?.stats.orderCount || 0, icon: '📦', color: 'bg-blue-50 text-blue-600 border-blue-200' },
                    { label: 'Products', value: data?.stats.productCount || 0, icon: '📱', color: 'bg-purple-50 text-purple-600 border-purple-200' },
                    { label: 'Users', value: data?.stats.userCount || 0, icon: '👥', color: 'bg-orange-50 text-orange-600 border-orange-200' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition">
                        <div className={`w-14 h-14 ${stat.color} border rounded-xl flex items-center justify-center text-3xl mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/admin/products/new" className="bg-[var(--color-accent)] text-white p-6 rounded-2xl shadow-lg hover:bg-[var(--color-accent-hover)] transition group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">➕</div>
                        <div>
                            <p className="font-bold text-lg">Add Product</p>
                            <p className="text-sm text-white/80">Create new product</p>
                        </div>
                    </div>
                </Link>
                <Link href="/admin/orders" className="bg-[var(--color-primary)] text-white p-6 rounded-2xl shadow-lg hover:opacity-90 transition group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📋</div>
                        <div>
                            <p className="font-bold text-lg">Manage Orders</p>
                            <p className="text-sm text-white/80">View all orders</p>
                        </div>
                    </div>
                </Link>
                <Link href="/admin/categories" className="bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] p-6 rounded-2xl shadow-sm hover:bg-[var(--color-bg-card)] transition group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center text-2xl">📂</div>
                        <div>
                            <p className="font-bold text-lg">Categories</p>
                            <p className="text-sm text-[var(--color-text-muted)]">Manage categories</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)]">
                <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-[var(--color-accent)] font-bold hover:text-[var(--color-accent-hover)] transition">View All →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--color-bg-card)]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Order #</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {data?.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-[var(--color-bg-card)] transition">
                                    <td className="px-6 py-4 font-mono font-bold text-[var(--color-primary)] text-sm">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">{order.user?.name || 'Guest'}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-[var(--color-accent)]">৳{order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            order.orderStatus === 'completed' || order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
                                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
