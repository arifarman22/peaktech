'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
    price: number;
}

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        shippingAddress: {
            fullName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'USA',
            phone: '',
        },
        paymentMethod: 'Credit Card',
        notes: '',
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/checkout');
        } else if (!authLoading && user) {
            fetchCart();
        }
    }, [user, authLoading]);

    const fetchCart = async () => {
        try {
            const res = await apiFetch('/cart');
            const data = await res.json();
            if (data.success) {
                if (data.data.items.length === 0) {
                    router.push('/cart');
                    return;
                }
                setCartItems(data.data.items);
                setTotal(data.data.total);
            }
        } catch (error) {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await apiFetch('/orders', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Order placed successfully!');
                router.push(`/orders/${data.data._id || ''}`);
            } else {
                toast.error(data.error || 'Failed to place order');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Footer />
        </div>
    );

    const tax = total * 0.1;
    const shippingCost = total > 100 ? 0 : 10;
    const grandTotal = total + tax + shippingCost;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col gap-12">
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">Complete Order</h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Final step to secure your gear</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Left: Forms */}
                        <div className="lg:col-span-7 space-y-12">

                            {/* Step 1: Shipping */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm shadow-xl">1</span>
                                    <h2 className="text-2xl font-black tracking-tight">Shipping</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-100">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                                        <input type="text" name="shippingAddress.fullName" value={formData.shippingAddress.fullName} onChange={handleChange} required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black/5 outline-none transition font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Address Line 1</label>
                                        <input type="text" name="shippingAddress.addressLine1" value={formData.shippingAddress.addressLine1} onChange={handleChange} required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black/5 outline-none transition font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">City</label>
                                        <input type="text" name="shippingAddress.city" value={formData.shippingAddress.city} onChange={handleChange} required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black/5 outline-none transition font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Postal Code</label>
                                        <input type="text" name="shippingAddress.postalCode" value={formData.shippingAddress.postalCode} onChange={handleChange} required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black/5 outline-none transition font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone</label>
                                        <input type="tel" name="shippingAddress.phone" value={formData.shippingAddress.phone} onChange={handleChange} required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-black/5 outline-none transition font-bold" />
                                    </div>
                                </div>
                            </section>

                            {/* Step 2: Payment */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm shadow-xl">2</span>
                                    <h2 className="text-2xl font-black tracking-tight">Payment</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                                        <label key={method} className={`relative flex items-center justify-between p-6 rounded-3xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method ? 'border-black bg-gray-50' : 'border-gray-50 hover:border-gray-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} className="w-4 h-4 text-black focus:ring-black border-gray-300" />
                                                <span className="font-bold text-gray-900">{method}</span>
                                            </div>
                                            <span className="text-xl">{method === 'Credit Card' ? '💳' : method === 'PayPal' ? '🅿️' : '💵'}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                <h3 className="text-2xl font-black mb-8">Review Collection</h3>

                                <div className="space-y-6 mb-10 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.product._id} className="flex gap-6 items-center">
                                            <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center p-3 border border-gray-100">
                                                <img src={item.product.images[0]} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-bold text-sm leading-tight line-clamp-1">{item.product.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 mt-1 uppercase">QTY: {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 border-t border-gray-200/50 pt-8 mb-10">
                                    <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">${total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-black">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-xl font-black">Total</span>
                                        <span className="text-3xl font-black">${grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting} className="w-full bg-black text-white py-6 rounded-full font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition shadow-2xl disabled:opacity-30">
                                    {submitting ? 'Confirming...' : 'Confirm Order'}
                                </button>

                                <p className="text-[10px] text-center text-gray-400 font-bold mt-6 uppercase tracking-widest">
                                    Secure SSL encrypted transaction
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
