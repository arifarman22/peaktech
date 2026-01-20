'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    category: { name: string; slug: string };
    quantity: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (params.slug) fetchProduct();
    }, [params.slug]);

    const fetchProduct = async () => {
        try {
            const res = await apiFetch(`/products/${params.slug}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.data);
            } else {
                toast.error(data.error || 'Product not found');
                router.push('/shop');
            }
        } catch (error) {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }

        setAddingToCart(true);
        try {
            const res = await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: product?._id, quantity }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Added to cart!');
                // Trigger navbar refresh if needed or just count on user to see notification
            } else {
                toast.error(data.error || 'Failed to add to cart');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setAddingToCart(false);
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

    if (!product) return null;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-32 lg:py-48">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                    {/* Left: Media */}
                    <div className="space-y-8">
                        <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden flex items-center justify-center p-12 hover:shadow-2xl transition duration-700 group">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl p-4 border-2 transition-all ${selectedImage === i ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain" alt={`Thumbnail ${i}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col h-full justify-center">
                        <div className="mb-10">
                            <Link href={`/shop?category=${product.category?.slug}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition">
                                {product.category?.name || 'TECHNOLOGY'}
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mt-4 mb-6 leading-tight tracking-tighter">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-4xl font-black text-black">${product.price.toLocaleString()}</span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="text-xl text-gray-300 line-through font-bold">${product.compareAtPrice.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg mb-12">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center bg-gray-50 rounded-full p-2 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-2xl font-black hover:bg-white rounded-full transition shadow-sm"
                                    >-</button>
                                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center text-2xl font-black hover:bg-white rounded-full transition shadow-sm"
                                    >+</button>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {product.quantity} units in stock
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={addToCart}
                                    disabled={addingToCart || product.quantity === 0}
                                    className="flex-grow bg-black text-white py-6 rounded-full font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition shadow-2xl disabled:opacity-30"
                                >
                                    {product.quantity === 0 ? 'Out of Stock' : addingToCart ? 'Linking...' : 'Add to Collection'}
                                </button>
                                <button className="px-10 py-6 border-2 border-gray-100 rounded-full font-black text-sm uppercase tracking-widest hover:border-black transition">
                                    Wishlist
                                </button>
                            </div>
                        </div>

                        {/* Specs Short */}
                        <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Shipping</h4>
                                <p className="text-sm font-bold">Fast global delivery</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Warranty</h4>
                                <p className="text-sm font-bold">2 Year limited warranty</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
