'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    user: { name: string; email: string; };
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        product: { name: string; images: string[]; };
        quantity: number;
        price: number;
    }>;
}

export default function AdminOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchOrders();
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const res = await apiFetch('/admin/orders');
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
                if (selectedOrder?._id === id) {
                    setSelectedOrder({ ...selectedOrder, orderStatus: status });
                }
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" /><p className="text-sm font-bold text-gray-400">Loading orders...</p></div></div>;
    if (user?.role !== 'admin') return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600 font-bold">Unauthorized Access</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-10">Order Management</h1>

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
                                        <td className="px-6 py-4 font-bold">৳{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className={`px-3 py-1 rounded-lg text-xs font-black uppercase outline-none cursor-pointer ${order.orderStatus === 'completed' || order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
                                                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-yellow-100 text-yellow-600'
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
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">{order.paymentStatus}</span></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 font-bold hover:underline">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500 font-mono mt-1">{selectedOrder.orderNumber}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Shipping Address */}
                            <div className="bg-indigo-50 rounded-2xl p-6">
                                <h3 className="text-sm font-black uppercase tracking-wider text-indigo-600 mb-4">📦 Delivery Address</h3>
                                <div className="space-y-2 text-gray-900">
                                    <p className="font-bold text-lg">{selectedOrder.shippingAddress.fullName}</p>
                                    <p className="font-medium">{selectedOrder.shippingAddress.phone}</p>
                                    <p>{selectedOrder.shippingAddress.address}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                                    <p className="font-bold">{selectedOrder.shippingAddress.country}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-3">Customer</h3>
                                    <p className="font-bold text-gray-900">{selectedOrder.user.name}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-3">Payment</h3>
                                    <p className="font-bold text-gray-900">{selectedOrder.paymentMethod}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.paymentStatus}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl" />
                                            <div className="flex-grow">
                                                <p className="font-bold text-gray-900">{item.product.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-black text-indigo-600">৳{selectedOrder.total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-sm font-black uppercase tracking-wider text-gray-600 mb-4">Update Status</h3>
                                <select
                                    value={selectedOrder.orderStatus}
                                    onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold outline-none focus:border-indigo-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
