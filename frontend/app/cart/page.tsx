'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        quantity: number;
        slug: string;
    };
    quantity: number;
    price: number;
}

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            fetchCart();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchCart = async () => {
        try {
            const data = await apiFetch('/cart');
            if (data.success) {
                setCartItems(data.data.items);
                setTotal(data.data.total);
            }
        } catch (error) {
            toast.error('Failed to load vessel');
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const data = await apiFetch('/cart', {
                method: 'DELETE',
                body: JSON.stringify({ productId }),
            });
            if (data.success) {
                fetchCart();
                toast.success('Unit removed');
            }
        } catch (error) {
            toast.error('Removal failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Scanning Unit</span>
                </div>
            </div>
            <Footer />
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center py-48 px-8 text-center">
                    <span className="text-zinc-100 font-black text-9xl absolute -z-10 select-none">RESTRICTED</span>
                    <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter mb-8 italic">Authentication Required.</h1>
                    <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.4em] mb-12 max-w-sm leading-relaxed">Identity verification is necessary to access your collection vessel.</p>
                    <Link href="/login" className="px-12 py-6 bg-zinc-950 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all premium-shadow active:scale-95">
                        Verify Identity
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const grandTotal = total + (total > 0 ? 100 : 0);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-40 lg:py-56">
                <div className="flex flex-col gap-20">
                    <div className="flex items-end justify-between border-b border-zinc-100 pb-12">
                        <div>
                            <span className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Shopping Vessel</span>
                            <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter mb-0">MY CART.</h1>
                        </div>
                        <p className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.3em]">
                            {cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'} REGISTERED
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-zinc-50 rounded-[48px] p-24 text-center border border-zinc-100 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-7xl mb-10 block grayscale group-hover:grayscale-0 transition-all">📦</span>
                            <h2 className="text-3xl font-black text-zinc-900 mb-8 relative z-10">Your cart is empty.</h2>
                            <Link href="/shop" className="inline-block px-12 py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all premium-shadow relative z-10">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-10">
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="group relative flex flex-col sm:flex-row items-center gap-10 bg-white p-10 rounded-[40px] border border-zinc-100 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                                        <div className="w-48 h-48 bg-zinc-50 rounded-[32px] flex-shrink-0 flex items-center justify-center p-8 border border-zinc-100 group-hover:bg-white transition-colors duration-500">
                                            <img src={item.product.images[0]} alt={item.product.name} className="max-h-full max-w-full object-cover rounded-2xl" />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-2xl font-black text-zinc-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8">
                                                PRICE: ৳ {item.product.price.toLocaleString()}
                                            </p>

                                            <div className="flex items-center justify-center sm:justify-start gap-10">
                                                <div className="flex items-center bg-zinc-950 text-white rounded-2xl px-5 py-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mr-4">QTY</span>
                                                    <span className="font-black tabular-nums">{item.quantity}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product._id)}
                                                    className="group/btn flex items-center gap-2 text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:text-red-500 transition-all"
                                                >
                                                    <span className="w-4 h-px bg-zinc-200 group-hover/btn:bg-red-500 transition-all" />
                                                    Remove Item
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-3xl font-black text-zinc-950 tabular-nums">
                                                ৳ {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Sidebar */}
                            <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
                                <div className="bg-zinc-950 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                    <h3 className="text-2xl font-black mb-12 italic relative z-10">Order Summary</h3>

                                    <div className="space-y-6 mb-12 border-b border-zinc-800 pb-10 relative z-10">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                            <span>Subtotal</span>
                                            <span className="text-white">৳ {total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                            <span>Logistics</span>
                                            <span className="text-indigo-400 font-black">{total > 0 ? `৳ 100` : '৳ 0'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mb-12 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Grand Total</span>
                                            <span className="text-4xl font-black tracking-tighter tabular-nums">৳ {grandTotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" className="block text-center w-full bg-white text-zinc-950 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all premium-shadow relative z-10 active:scale-95">
                                        Proceed to Checkout
                                    </Link>

                                    <div className="mt-10 flex justify-center gap-6 opacity-20 filter grayscale hover:grayscale-0 transition-all duration-700">
                                        {['VISA', 'BKASH', 'COD'].map(p => (
                                            <span key={p} className="text-[10px] font-black border border-white/20 px-3 py-1 rounded-lg">{p}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
