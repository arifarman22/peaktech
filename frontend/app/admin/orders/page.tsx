'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    shippingAddress: { fullName: string };
}

export default function AdminOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchOrders();
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const res = await apiFetch('/admin/orders'); // I need to implement this in backend
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await apiFetch(`/admin/orders/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ orderStatus: status }),
            });
            if (res.ok) {
                toast.success('Order updated');
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (authLoading || loading) return <div className="p-20 text-center">Loading...</div>;
    if (user?.role !== 'admin') return <div className="p-20 text-center text-red-600">Unauthorized</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-black text-gray-900 mb-10">Manage Orders</h1>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Order #</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Customer</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Total</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Payment</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-900">{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.shippingAddress.fullName}</td>
                                        <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className={`px-3 py-1 rounded-lg text-xs font-black uppercase outline-none ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-600' :
                                                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-100 text-blue-600'
                                                    }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{order.paymentStatus}</td>
                                        <td className="px-6 py-4">
                                            <button className="text-purple-600 font-bold hover:underline">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
