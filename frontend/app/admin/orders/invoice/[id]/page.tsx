'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/utils/api';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    trackingNumber?: string;
    createdAt: string;
    user: { name: string; email: string; };
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchOrder();
        }
    }, [user]);

    const fetchOrder = async () => {
        try {
            const data = await apiFetch(`/admin/orders`);
            if (data.success) {
                const foundOrder = data.data.find((o: Order) => o._id === params.id);
                setOrder(foundOrder || null);
            }
        } catch (error) {
            console.error('Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
    if (!order) return <div className="text-center py-20">Order not found</div>;
    if (user?.role !== 'admin') return <div className="text-center py-20 text-red-600">Unauthorized</div>;

    const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${order.orderNumber}`;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-6 mb-6 print:hidden flex gap-3">
                <button onClick={() => router.back()} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">← Back</button>
                <button onClick={handlePrint} className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:from-[#4338CA] hover:to-[#6D28D9] transition">🖨️ Print Invoice</button>
                <button onClick={handlePrint} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">📥 Download PDF</button>
            </div>

            <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
                <div className="p-12">
                    <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-gray-200">
                        <div>
                            <img src="/logo.png?v=1" alt="PeakTech" className="h-12 mb-4" />
                            <p className="text-sm text-gray-600">PeakTech E-Commerce</p>
                            <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
                            <p className="text-sm text-gray-600">support@peaktech.com</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h1>
                            <p className="text-lg font-semibold text-indigo-600">{invoiceNumber}</p>
                            <p className="text-sm text-gray-600 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Bill To:</h3>
                            <p className="font-bold text-gray-800">{order.shippingAddress.fullName}</p>
                            <p className="text-sm text-gray-600">{order.user.email}</p>
                            <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                            <p className="text-sm text-gray-600 mt-2">{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>}
                            <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p className="text-sm text-gray-600">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Order Details:</h3>
                            <div className="space-y-1">
                                <p className="text-sm"><span className="font-semibold">Order ID:</span> {order.orderNumber}</p>
                                <p className="text-sm"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
                                <p className="text-sm"><span className="font-semibold">Payment Status:</span> <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus.toUpperCase()}</span></p>
                                <p className="text-sm"><span className="font-semibold">Delivery Status:</span> <span className="font-bold text-blue-600">{order.orderStatus.toUpperCase()}</span></p>
                                {order.trackingNumber && <p className="text-sm"><span className="font-semibold">Tracking:</span> {order.trackingNumber}</p>}
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-8">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="text-left py-3 px-4 font-bold text-gray-700">Item</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-700">Quantity</th>
                                <th className="text-right py-3 px-4 font-bold text-gray-700">Unit Price</th>
                                <th className="text-right py-3 px-4 font-bold text-gray-700">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                                    <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                                    <td className="py-3 px-4 text-right text-gray-800">৳{item.price.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right font-semibold text-gray-800">৳{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mb-12">
                        <div className="w-80">
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold text-gray-800">৳{order.subtotal.toLocaleString()}</span>
                            </div>
                            {order.tax > 0 && (
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-semibold text-gray-800">৳{order.tax.toLocaleString()}</span>
                                </div>
                            )}
                            {order.shippingCost > 0 && (
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-semibold text-gray-800">৳{order.shippingCost.toLocaleString()}</span>
                                </div>
                            )}
                            {order.discount > 0 && (
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-semibold text-red-600">-৳{order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
                                <span className="text-lg font-bold text-gray-800">Total:</span>
                                <span className="text-2xl font-bold text-indigo-600">৳{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Thank you for your business!</p>
                        <p className="text-xs text-gray-500 mt-2">This is a computer-generated invoice and does not require a signature.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
