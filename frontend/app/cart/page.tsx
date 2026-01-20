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
            const res = await apiFetch('/cart');
            const data = await res.json();
            if (data.success) {
                setCartItems(data.data.items);
                setTotal(data.data.total);
            }
        } catch (error) {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const res = await apiFetch('/cart', {
                method: 'DELETE',
                body: JSON.stringify({ productId }),
            });
            if (res.ok) {
                fetchCart();
                toast.success('Removed from cart');
            }
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Footer />
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center py-48 px-6 text-center">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-6">Access Denied.</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] mb-12">Sign in to manage your collection</p>
                    <Link href="/login" className="px-12 py-6 bg-black text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition shadow-2xl">
                        Log In Now
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const grandTotal = total + (total > 0 ? (total * 0.1) : 0) + (total > 100 ? 0 : (total > 0 ? 10 : 0));

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-32 lg:py-48">
                <div className="flex flex-col gap-12">
                    <div className="text-center sm:text-left">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4">Shopping Cart</h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-gray-50 rounded-[3rem] p-24 text-center border border-gray-100 animate-in fade-in duration-700">
                            <span className="text-7xl mb-10 block">🛒</span>
                            <h2 className="text-3xl font-black text-gray-900 mb-6">Your bag is empty</h2>
                            <Link href="/shop" className="inline-block px-12 py-6 bg-black text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition shadow-2xl">
                                Discover Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-8">
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="group relative flex flex-col sm:flex-row items-center gap-10 bg-white p-8 rounded-[2.5rem] border border-gray-50 hover:border-gray-200 transition-all duration-500 hover:shadow-xl">
                                        <div className="w-40 h-40 bg-gray-50 rounded-3xl flex-shrink-0 flex items-center justify-center p-6 border border-gray-100 group-hover:rotate-3 transition duration-500">
                                            <img src={item.product.images[0]} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">
                                                Price: ${item.product.price.toLocaleString()}
                                            </p>

                                            <div className="flex items-center justify-center sm:justify-start gap-8">
                                                <div className="flex items-center bg-gray-50 rounded-full px-4 py-1 border border-gray-100">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-4">Quantity</span>
                                                    <span className="font-black">{item.quantity}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product._id)}
                                                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-2xl font-black text-black">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Sidebar */}
                            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                                <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                    <h3 className="text-2xl font-black mb-8 italic">Summary</h3>

                                    <div className="space-y-6 mb-10 border-b border-gray-200/50 pb-8">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Subtotal</span>
                                            <span className="text-black">${total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Surcharge (VAT)</span>
                                            <span className="text-black">${(total * 0.1).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Eco-Shipping</span>
                                            <span className="text-black">{total > 100 ? 'FREE' : '$10'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-10">
                                        <span className="text-2xl font-black">Total</span>
                                        <span className="text-4xl font-black font-mono tracking-tighter">${grandTotal.toLocaleString()}</span>
                                    </div>

                                    <Link href="/checkout" className="block text-center w-full bg-black text-white py-6 rounded-full font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition shadow-2xl">
                                        Checkout Now
                                    </Link>

                                    <div className="mt-8 flex justify-center gap-4">
                                        <span className="text-2xl">💳</span>
                                        <span className="text-2xl">🅿️</span>
                                        <span className="text-2xl">💵</span>
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
