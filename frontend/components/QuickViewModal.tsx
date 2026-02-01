'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

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

interface QuickViewProps {
    product: Product;
    onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        try {
            const res = await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: product._id, quantity }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Unit added to vessel');
                onClose();
            } else {
                toast.error(data.error || 'Acquisition failed');
            }
        } catch (error) {
            toast.error('Identity required for acquisition');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}>
            <div className="bg-white rounded-[48px] max-w-5xl w-full max-h-[90vh] overflow-y-auto premium-shadow border border-zinc-100 relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-all z-10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-12 md:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Images */}
                        <div>
                            <div className="aspect-square bg-zinc-50 rounded-[40px] overflow-hidden mb-6 group border border-zinc-100/50">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-105"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square bg-zinc-50 rounded-2xl overflow-hidden border-2 transition-all p-1.5 ${selectedImage === i ? 'border-indigo-600' : 'border-transparent hover:border-zinc-200'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col">
                            <Link href={`/shop?category=${product.category.slug}`} className="inline-block text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 hover:text-indigo-700 transition-colors">
                                {product.category.name}
                            </Link>
                            <h3 className="text-3xl md:text-4xl font-black text-zinc-950 mb-6 leading-tight tracking-tight italic">{product.name}</h3>

                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-3xl font-black text-zinc-950">৳{product.price.toLocaleString()}</span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="text-xl text-zinc-400 line-through font-bold">৳{product.compareAtPrice.toLocaleString()}</span>
                                )}
                            </div>

                            <p className="text-zinc-500 font-medium mb-10 text-sm leading-relaxed line-clamp-4">{product.description}</p>

                            <div className="mt-auto space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Archival Quantity</h4>
                                    <div className="flex items-center bg-zinc-950 text-white rounded-2xl p-1.5 w-fit">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                                        </button>
                                        <span className="w-10 text-center font-black tabular-nums text-xs">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={addToCart}
                                        className="py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all premium-shadow flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        Add to Cart
                                    </button>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="py-5 bg-zinc-50 text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-100 transition-all text-center border border-zinc-100/50"
                                    >
                                        Full Dossier
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
