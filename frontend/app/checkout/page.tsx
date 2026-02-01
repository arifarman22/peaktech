'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';
import Link from 'next/link';

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
            country: 'Bangladesh',
            phone: '',
        },
        paymentMethod: 'Cash on Delivery',
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
            toast.error('Cart sync failed');
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
                toast.success('Order confirmed!');
                router.push(`/orders/${data.data._id || ''}`);
            } else {
                toast.error(data.error || 'Order failed');
            }
        } catch (error) {
            toast.error('Checkout error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Checkout</span>
                </div>
            </div>
            <Footer />
        </div>
    );

    const shippingCost = 100;
    const grandTotal = total + shippingCost;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-40 lg:py-56">
                <div className="flex flex-col gap-20">
                    <div className="border-b border-zinc-100 pb-12">
                        <span className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Secure Checkout</span>
                        <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter mb-0 italic">CHECKOUT.</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

                        {/* Left: Forms */}
                        <div className="lg:col-span-7 space-y-20">

                            {/* Step 1: Shipping */}
                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <span className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center font-black text-sm premium-shadow">01</span>
                                    <h2 className="text-3xl font-black tracking-tight">SHIPPING ADDRESS</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50 p-12 rounded-[48px] border border-zinc-100">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Full Name</label>
                                        <input type="text" name="shippingAddress.fullName" placeholder="Full Name" value={formData.shippingAddress.fullName} onChange={handleChange} required className="w-full bg-white border border-zinc-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Street Address</label>
                                        <input type="text" name="shippingAddress.addressLine1" placeholder="Street Address" value={formData.shippingAddress.addressLine1} onChange={handleChange} required className="w-full bg-white border border-zinc-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">City</label>
                                        <input type="text" name="shippingAddress.city" placeholder="City" value={formData.shippingAddress.city} onChange={handleChange} required className="w-full bg-white border border-zinc-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">State</label>
                                        <input type="text" name="shippingAddress.state" placeholder="State" value={formData.shippingAddress.state} onChange={handleChange} required className="w-full bg-white border border-zinc-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Postal Code</label>
                                        <input type="text" name="shippingAddress.postalCode" placeholder="Code" value={formData.shippingAddress.postalCode} onChange={handleChange} required className="w-full bg-white border border-zinc-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Phone Number</label>
                                        <input type="tel" name="shippingAddress.phone" placeholder="+880..." value={formData.shippingAddress.phone} onChange={handleChange} required className="w-full bg-white border border-zinc-100 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold" />
                                    </div>
                                </div>
                            </section>

                            {/* Step 2: Payment */}
                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <span className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center font-black text-sm premium-shadow">02</span>
                                    <h2 className="text-3xl font-black tracking-tight">PAYMENT METHOD</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
                                        { id: 'ONLINE', label: 'Online Payment', icon: '💳' }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`relative flex items-center justify-between p-8 rounded-[32px] border-2 cursor-pointer transition-all ${formData.paymentMethod === method.label ? 'border-indigo-600 bg-indigo-50/10 shadow-xl shadow-indigo-500/5' : 'border-zinc-100 hover:border-zinc-200 bg-white'}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.label}
                                                    checked={formData.paymentMethod === method.label}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 accent-indigo-600"
                                                />
                                                <span className="font-black text-zinc-950 uppercase text-xs tracking-widest">{method.label}</span>
                                            </div>
                                            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{method.icon}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-5 lg:sticky lg:top-40 h-fit">
                            <div className="bg-zinc-950 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                <h3 className="text-2xl font-black mb-12 italic relative z-10">Order Summary</h3>

                                <div className="space-y-8 mb-12 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide relative z-10">
                                    {cartItems.map((item) => (
                                        <div key={item.product._id} className="flex gap-6 items-center group/item">
                                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center p-3 border border-white/10 group-hover/item:bg-white/10 transition-colors">
                                                <img src={item.product.images[0]} alt={item.product.name} className="max-h-full max-w-full object-cover rounded-xl" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-black text-xs leading-tight line-clamp-1 uppercase tracking-wider">{item.product.name}</p>
                                                <p className="text-[9px] font-black text-zinc-500 mt-2 uppercase tracking-widest">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-sm tabular-nums">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-5 border-t border-white/10 pt-10 mb-12 relative z-10">
                                    <div className="flex justify-between text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-white">৳ {total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                                        <span>Logistics</span>
                                        <span className="text-indigo-400">৳ 100</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-6">
                                        <span className="text-2xl font-black italic">Final Total</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-4xl font-black tabular-nums tracking-tighter">৳ {grandTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all premium-shadow disabled:opacity-30 relative z-10 active:scale-95"
                                >
                                    {submitting ? 'PROCESSING...' : 'CONFIRM ORDER'}
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-3 opacity-30 relative z-10">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
