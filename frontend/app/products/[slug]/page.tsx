'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    quantity: number;
    images: string[];
    category: { name: string; slug: string };
    sizes?: string[];
}

export default function ProductDetailsPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [params.slug]);

    const fetchProduct = async () => {
        try {
            const data = await apiFetch(`/products/${params.slug}`);
            if (data.success) setProduct(data.data);
        } catch (error) {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        try {
            const data = await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: product?._id, quantity }),
            });
            if (data.success) {
                toast.success('Unit added to vessel');
            } else {
                toast.error(data.error || 'Acquisition failed');
            }
        } catch (error) {
            toast.error('Identity required for acquisition');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Syncing Repository</span>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-black mb-4">404</h1>
                <p className="text-zinc-500 font-medium mb-8">Resource not found in current sector.</p>
                <Link href="/shop" className="inline-block px-10 py-4 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Return to Store</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-40 pb-32">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Images */}
                        <div className="lg:col-span-7">
                            <div className="sticky top-40 space-y-8">
                                <div className="aspect-square bg-zinc-50 rounded-[48px] overflow-hidden group relative">
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className="absolute top-8 right-8 w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all active:scale-90"
                                    >
                                        <svg className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-900'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-6">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`aspect-square bg-zinc-50 rounded-3xl overflow-hidden border-2 transition-all p-2 ${selectedImage === i ? 'border-indigo-600' : 'border-transparent hover:border-zinc-200'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-5">
                            <div className="mb-10">
                                <Link href={`/shop?category=${product.category.slug}`} className="inline-block text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 hover:text-indigo-700 transition-colors">
                                    {product.category.name}
                                </Link>
                                <h1 className="text-4xl md:text-5xl font-black text-zinc-950 mb-6 leading-[1.1] tracking-tight">{product.name}</h1>

                                <div className="flex items-center gap-6 mb-10">
                                    <span className="text-4xl font-black text-zinc-950">৳{product.price.toLocaleString()}</span>
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl text-zinc-400 line-through font-bold">৳{product.compareAtPrice.toLocaleString()}</span>
                                            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
                                                -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-zinc-100 w-full mb-10" />

                                <div className="space-y-6 mb-12">
                                    <p className="text-zinc-500 font-medium leading-relaxed text-lg">{product.description}</p>
                                    <div className="flex items-center gap-4 py-4 px-6 bg-zinc-50 rounded-2xl w-fit">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">In Stock: {product.quantity} Units</span>
                                    </div>
                                </div>

                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="mb-12">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Specification Mode</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map((size) => (
                                                <button key={size} className="px-6 py-3 border-2 border-zinc-100 rounded-xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-12">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Quantity Selection</h4>
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center bg-zinc-900 text-white rounded-2xl p-2">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-zinc-800 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                                            </button>
                                            <span className="w-12 text-center font-black tabular-nums">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-zinc-800 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <button
                                        onClick={addToCart}
                                        className="py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all premium-shadow active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        Add to Cart
                                    </button>
                                    <Link
                                        href="/cart"
                                        className="py-5 bg-zinc-950 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 transition-all text-center active:scale-95 border border-zinc-800"
                                    >
                                        Execute Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
