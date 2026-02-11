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
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchOrders();
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const data = await apiFetch('/admin/orders');
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
            const data = await apiFetch(`/admin/orders/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ orderStatus: status }),
            });
            if (data.success) {
                toast.success('Order updated');
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

    if (authLoading || loading) return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" /></div>;
    if (user?.role !== 'admin') return <div className="text-center py-20 text-[var(--color-destructive)] font-bold">Unauthorized Access</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-primary)]">Order Management</h1>
                <div className="flex gap-2">
                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${
                                filter === status
                                    ? 'bg-[var(--color-accent)] text-white'
                                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-md transition">
                        {/* Order Header */}
                        <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-[var(--color-bg-card)] transition" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                            <div className="flex items-center gap-6">
                                <div>
                                    <p className="font-mono font-bold text-[var(--color-primary)]">{order.orderNumber}</p>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="h-12 w-px bg-[var(--color-border)]" />
                                <div>
                                    <p className="text-sm text-[var(--color-text-muted)]">Customer</p>
                                    <p className="font-bold text-[var(--color-text-primary)]">{order.shippingAddress.fullName}</p>
                                </div>
                                <div className="h-12 w-px bg-[var(--color-border)]" />
                                <div>
                                    <p className="text-sm text-[var(--color-text-muted)]">Total</p>
                                    <p className="font-bold text-[var(--color-accent)] text-lg">৳{order.total.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => { e.stopPropagation(); updateStatus(order._id, e.target.value); }}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase outline-none cursor-pointer transition ${
                                        order.orderStatus === 'completed' || order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
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
                                <svg className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Expanded Order Details */}
                        {expandedOrder === order._id && (
                            <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 space-y-6">
                                {/* Customer & Shipping Info */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl p-5 border border-[var(--color-border)]">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Customer Info</h3>
                                        <p className="font-bold text-[var(--color-text-primary)]">{order.user.name}</p>
                                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{order.user.email}</p>
                                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{order.shippingAddress.phone}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-5 border border-[var(--color-border)]">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Shipping Address</h3>
                                        <p className="text-sm text-[var(--color-text-primary)]">{order.shippingAddress.address}</p>
                                        <p className="text-sm text-[var(--color-text-primary)]">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                        <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1">{order.shippingAddress.country}</p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)]">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Payment Details</h3>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-sm text-[var(--color-text-muted)]">Method</p>
                                            <p className="font-bold text-[var(--color-text-primary)]">{order.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-text-muted)]">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>{order.paymentStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white rounded-xl p-5 border border-[var(--color-border)]">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Order Items</h3>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-[var(--color-bg-card)] rounded-lg">
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                                                <div className="flex-grow">
                                                    <p className="font-bold text-[var(--color-text-primary)]">{item.product.name}</p>
                                                    <p className="text-sm text-[var(--color-text-muted)]">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                                                </div>
                                                <p className="font-bold text-[var(--color-accent)]">৳{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                                        <span className="font-bold text-[var(--color-text-primary)]">Total Amount</span>
                                        <span className="text-2xl font-bold text-[var(--color-accent)]">৳{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-border)]">
                    <p className="text-[var(--color-text-muted)] font-medium">No orders found</p>
                </div>
            )}
        </div>
    );
}
