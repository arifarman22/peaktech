'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { apiFetch } from '@/lib/utils/api';
import { OrderSkeleton } from '@/components/Skeletons';
import Link from 'next/link';

interface OrderDetail {
    _id: string;
    orderNumber: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    items: Array<{
        product: { name: string; price: number; image: string; slug: string };
        quantity: number;
        price: number;
    }>;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await apiFetch(`/orders/${id}`);
            const data = await res.json();
            if (data.success) setOrder(data.data);
        } catch (error) {
            console.error('Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12"><OrderSkeleton /></div>
        </div>
    );

    if (!order) return <div className="p-20 text-center">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/orders" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50">←</Link>
                    <h1 className="text-3xl font-black text-gray-900">Order #{order.orderNumber}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Status Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Order Status</h2>
                                <span className={`px-4 py-1 rounded-full text-sm font-black uppercase ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-purple-600" style={{ width: order.orderStatus === 'completed' ? '100%' : '50%' }}></div>
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Placed</span>
                                <span>Processing</span>
                                <span>Shipped</span>
                                <span>Delivered</span>
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <h2 className="text-xl font-bold">Items</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item, i) => (
                                    <div key={i} className="p-8 flex items-center gap-6">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.product?.image || 'https://via.placeholder.com/150'} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <Link href={`/products/${item.product?.slug}`} className="font-bold text-gray-900 hover:text-purple-600 transition">{item.product?.name}</Link>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Summary Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6">Summary</h2>
                            <div className="space-y-4 text-gray-600 border-b border-gray-50 pb-6 mb-6">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">${order.total.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-gray-900">FREE</span></div>
                                <div className="flex justify-between"><span>Tax</span><span className="font-bold text-gray-900">$0.00</span></div>
                            </div>
                            <div className="flex justify-between text-xl font-black text-gray-900">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                            <div className="text-gray-600 text-sm space-y-1">
                                <p className="font-bold text-gray-900 text-base">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
