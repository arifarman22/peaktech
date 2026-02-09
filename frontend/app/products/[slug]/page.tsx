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
    category: { _id: string; name: string; slug: string };
    sizes?: string[];
}

interface Review {
    _id: string;
    user: { name: string; email: string };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ProductDetailsPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [params.slug]);

    useEffect(() => {
        if (product) {
            fetchReviews();
            fetchSimilarProducts();
        }
    }, [product]);

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

    const fetchReviews = async () => {
        try {
            const data = await apiFetch(`/reviews/product/${product?._id}`);
            if (data.success) {
                setReviews(data.data.reviews);
                setAvgRating(data.data.avgRating);
                setTotalReviews(data.data.totalReviews);
            }
        } catch (error) {
            console.error('Failed to fetch reviews');
        }
    };

    const fetchSimilarProducts = async () => {
        try {
            const data = await apiFetch(`/products?category=${product?.category._id}&limit=4`);
            if (data.success) {
                setSimilarProducts(data.data.products.filter((p: Product) => p._id !== product?._id).slice(0, 4));
            }
        } catch (error) {
            console.error('Failed to fetch similar products');
        }
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/reviews', {
                method: 'POST',
                body: JSON.stringify({ productId: product?._id, rating, comment }),
            });
            if (data.success) {
                toast.success('Review submitted');
                setComment('');
                setRating(5);
                fetchReviews();
            } else {
                toast.error(data.error || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Please login to submit a review');
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

                    {/* Reviews Section */}
                    <div className="mt-32">
                        <div className="border-t border-zinc-100 pt-16">
                            <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
                            
                            {avgRating > 0 && (
                                <div className="flex items-center gap-6 mb-12 p-6 bg-zinc-50 rounded-2xl w-fit">
                                    <div className="text-center">
                                        <div className="text-4xl font-black mb-2">{avgRating}</div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-zinc-300'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-sm text-zinc-600">
                                        <div className="font-bold">{totalReviews} Reviews</div>
                                    </div>
                                </div>
                            )}

                            {/* Review Form */}
                            <form onSubmit={submitReview} className="mb-12 p-8 bg-zinc-50 rounded-2xl">
                                <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-3">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="text-3xl transition-colors"
                                            >
                                                <svg className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-zinc-300'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-3">Comment</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:outline-none"
                                        placeholder="Share your experience with this product..."
                                    />
                                </div>
                                <button type="submit" className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
                                    Submit Review
                                </button>
                            </form>

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-12">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="p-6 border border-zinc-100 rounded-2xl">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="font-bold text-lg">{review.user.name}</div>
                                                    <div className="flex gap-1 mt-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-zinc-300'}`} viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-zinc-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-zinc-700 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <div className="mt-32">
                            <div className="border-t border-zinc-100 pt-16">
                                <h2 className="text-3xl font-bold mb-12">Similar Products</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {similarProducts.map((p) => (
                                        <Link key={p._id} href={`/products/${p.slug}`} className="group">
                                            <div className="aspect-square bg-zinc-50 rounded-2xl overflow-hidden mb-4">
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-zinc-600 transition-colors">{p.name}</h3>
                                            <div className="text-xl font-black">৳{p.price.toLocaleString()}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
