'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/utils/api';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    category: { name: string; slug: string; _id: string };
    quantity: number;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [topRated, setTopRated] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    const currentCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('q') || '';
    const trending = searchParams.get('trending') === 'true';
    const topSeller = searchParams.get('topSeller') === 'true';

    useEffect(() => {
        fetchCategories();
        fetchTrending();
        fetchBestSellers();
        fetchTopRated();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentCategory, searchQuery, page, minPrice, maxPrice, trending, topSeller]);

    const fetchCategories = async () => {
        try {
            const data = await apiFetch('/categories');
            if (data.success) setCategories(data.data);
        } catch (error) { }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `/products?limit=12&page=${page}`;
            if (currentCategory) url += `&category=${currentCategory}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (minPrice) url += `&minPrice=${minPrice}`;
            if (maxPrice) url += `&maxPrice=${maxPrice}`;
            if (trending) url += `&trending=true`;
            if (topSeller) url += `&topSeller=true`;

            const data = await apiFetch(url);
            if (data.success) {
                setProducts(data.data.products);
                setTotalPages(data.data.pagination.pages);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async () => {
        try {
            const data = await apiFetch('/products?trending=true&limit=4');
            if (data.success) setTrendingProducts(data.data.products);
        } catch (error) { }
    };

    const fetchBestSellers = async () => {
        try {
            const data = await apiFetch('/products?topSeller=true&limit=4');
            if (data.success) setBestSellers(data.data.products);
        } catch (error) { }
    };

    const fetchTopRated = async () => {
        try {
            const data = await apiFetch('/products?featured=true&limit=4');
            if (data.success) setTopRated(data.data.products);
        } catch (error) { }
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-8 pt-32 pb-20">
                {/* Shop Header */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Shop
                    </h1>
                    <p className="text-zinc-600 font-medium max-w-2xl text-lg">
                        Explore our curated collection of high-performance electronics and precision industrial parts.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-32 space-y-8">
                            {/* Categories */}
                            <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                    Categories
                                </h3>
                                <div className="space-y-1">
                                    <Link
                                        href="/shop"
                                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${!currentCategory
                                            ? 'bg-zinc-900 text-white'
                                            : 'text-zinc-600 hover:bg-zinc-50'
                                            }`}
                                    >
                                        All Products
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat._id}
                                            href={`/shop?category=${cat.slug}`}
                                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentCategory === cat.slug
                                                ? 'bg-zinc-900 text-white'
                                                : 'text-zinc-600 hover:bg-zinc-50'
                                                }`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                    Price Range
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500">Min</label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => { setPage(1); setMinPrice(e.target.value); }}
                                            placeholder="0"
                                            className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-900 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500">Max</label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }}
                                            placeholder="99999"
                                            className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-900 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Trending */}
                            {trendingProducts.length > 0 && (
                                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-6 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                        Trending Now
                                    </h3>
                                    <div className="space-y-4">
                                        {trendingProducts.map((p) => (
                                            <Link key={p._id} href={`/products/${p.slug}`} className="flex gap-3 group">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                                                    <p className="text-sm font-bold text-indigo-600 mt-1">৳{p.price.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Best Sellers */}
                            {bestSellers.length > 0 && (
                                <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-6 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-amber-600 rounded-full"></span>
                                        Best Sellers
                                    </h3>
                                    <div className="space-y-4">
                                        {bestSellers.map((p) => (
                                            <Link key={p._id} href={`/products/${p.slug}`} className="flex gap-3 group">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-amber-600 transition-colors">{p.name}</h4>
                                                    <p className="text-sm font-bold text-amber-600 mt-1">৳{p.price.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Rated */}
                            {topRated.length > 0 && (
                                <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-6 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
                                        Top Rated
                                    </h3>
                                    <div className="space-y-4">
                                        {topRated.map((p) => (
                                            <Link key={p._id} href={`/products/${p.slug}`} className="flex gap-3 group">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">{p.name}</h4>
                                                    <p className="text-sm font-bold text-emerald-600 mt-1">৳{p.price.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-900">
                                    {products.length} Products
                                </h2>
                                {searchQuery && (
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Search results for: <span className="font-bold text-orange-600">"{searchQuery}"</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-zinc-100 aspect-square rounded-2xl mb-4" />
                                        <div className="h-4 bg-zinc-100 rounded w-1/3 mb-3" />
                                        <div className="h-6 bg-zinc-100 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border border-zinc-200">
                                <span className="text-4xl mb-4 block">📋</span>
                                <h3 className="text-xl font-bold mb-2 text-zinc-900">No products found</h3>
                                <p className="text-zinc-500 font-medium text-sm">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-4">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-900"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="text-sm font-medium text-zinc-600">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-900"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });
            if (data.success) {
                toast.success('Added to cart');
            } else {
                toast.error(data.error || 'Failed to add');
            }
        } catch (error) {
            toast.error('Please login to add to cart');
        }
    };

    const buyNow = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });
            if (data.success) {
                window.location.href = '/checkout';
            } else {
                toast.error(data.error || 'Failed');
            }
        } catch (error) {
            toast.error('Please login to continue');
        }
    };

    return (
        <div className="group bg-white rounded-2xl border border-zinc-200/60 p-3 transition-all duration-500 hover:shadow-xl hover:border-black">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-3 transition-all duration-500 group-hover:shadow-lg">
                <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                        </span>
                    </div>
                )}
            </div>
            <div className="px-1">
                <p className="text-xs font-medium text-zinc-500 mb-2">{product.category.name}</p>
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-2 line-clamp-2 hover:text-zinc-600 transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-zinc-900">৳{product.price.toLocaleString()}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-sm text-zinc-400 line-through font-medium">৳{product.compareAtPrice.toLocaleString()}</span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={addToCart}
                        className="px-3 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={buyNow}
                        className="px-3 py-2 bg-white border-2 border-zinc-900 text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-all active:scale-95"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
