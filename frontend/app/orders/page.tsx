'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            fetchOrders();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const res = await apiFetch('/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data.orders);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="p-20 text-center">Loading your orders...</div></div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
                    <p className="text-gray-600 mb-8">Please login to view your order history.</p>
                    <Link href="/login" className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition">Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-black text-gray-900 mb-10">Order History</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
                        <p className="text-gray-600 mb-8">You haven't placed any orders with us yet.</p>
                        <Link href="/shop" className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="bg-gray-50 p-6 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                                            <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                            <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-600' :
                                                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order #</p>
                                        <p className="font-mono text-gray-900">{order.orderNumber}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-2 border border-gray-100">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                                    ) : (
                                                        <span className="text-2xl">📦</span>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                    <p className="text-gray-500 text-sm">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
