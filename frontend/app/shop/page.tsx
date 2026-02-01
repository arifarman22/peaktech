'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/utils/api';
import Footer from '@/components/Footer';

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
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentCategory, searchQuery, page, minPrice, maxPrice, trending, topSeller]);

    const fetchCategories = async () => {
        try {
            const res = await apiFetch('/categories');
            const data = await res.json();
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

            const res = await apiFetch(url);
            const data = await res.json();
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

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-8 pt-40 pb-20">
                {/* Shop Header */}
                <div className="mb-20">
                    <span className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Archive 2026</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 mb-6">
                        THE <span className="gradient-text">COLLECTION</span>
                    </h1>
                    <p className="text-zinc-500 font-medium max-w-xl leading-relaxed">
                        Explore our meticulously indexed repository of high-performance electronics, precision industrial parts, and artisanal global harvests.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-32 space-y-16">
                            {/* Categories */}
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-10">Categories</h3>
                                <div className="space-y-2 p-8 rounded-[32px] bg-zinc-950 border border-white/5 shadow-2xl">
                                    <Link
                                        href="/shop"
                                        className={`block w-full text-left px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${!currentCategory
                                            ? 'bg-white text-zinc-950 shadow-lg shadow-white/5 scale-[1.02]'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        All Spectrum
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat._id}
                                            href={`/shop?category=${cat.slug}`}
                                            className={`block w-full text-left px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${currentCategory === cat.slug
                                                ? 'bg-white text-zinc-950 shadow-lg shadow-white/5 scale-[1.02]'
                                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-10">Price Range</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-zinc-400 ml-1">Min (৳)</label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => { setPage(1); setMinPrice(e.target.value); }}
                                            placeholder="0"
                                            className="w-full bg-zinc-950 border border-white/5 px-4 py-3 rounded-xl font-black text-xs text-white focus:border-indigo-500 focus:bg-zinc-900 transition-all outline-none placeholder-zinc-800 shadow-2xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-zinc-500 ml-1">Max (৳)</label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }}
                                            placeholder="99k"
                                            className="w-full bg-zinc-950 border border-white/5 px-4 py-3 rounded-xl font-black text-xs text-white focus:border-indigo-500 focus:bg-zinc-900 transition-all outline-none placeholder-zinc-800 shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-8 rounded-[32px] bg-zinc-950 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/40 transition-colors" />
                                <h4 className="text-xl font-black mb-4 relative z-10 leading-tight">Elite Support.</h4>
                                <p className="text-zinc-400 font-medium text-xs mb-8 relative z-10 leading-relaxed">Need technical specifications or custom industrial sourcing? Our experts are available 24/7.</p>
                                <button className="w-full py-4 bg-white text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest relative z-10 hover:bg-zinc-100 transition-colors">Contact Expert</button>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                Showing {products.length} Products
                            </h2>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-100" />
                                <div className="w-2 h-2 rounded-full bg-zinc-200" />
                                <div className="w-2 h-2 rounded-full bg-zinc-900" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-zinc-50 aspect-square rounded-[40px] mb-6" />
                                        <div className="h-4 bg-zinc-50 rounded w-1/3 mb-4" />
                                        <div className="h-8 bg-zinc-50 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-100">
                                <span className="text-4xl mb-6 block">📂</span>
                                <h3 className="text-xl font-black mb-2">No records found</h3>
                                <p className="text-zinc-500 font-medium text-sm">Adjust your filters or query parameters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-32 flex justify-center items-center gap-6">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all disabled:opacity-20"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Sector</span>
                                            <span className="text-lg font-black tabular-nums">{page} / {totalPages}</span>
                                        </div>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all disabled:opacity-20"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
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
    return (
        <div className="group">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-zinc-50 mb-6 transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-110"
                    />
                </Link>
                <div className="absolute top-6 left-6">
                    <span className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-900 border border-black/5 shadow-sm">
                        {product.category.name}
                    </span>
                </div>
            </div>
            <div className="px-2">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3 line-clamp-2 hover:text-indigo-600 transition-colors h-14">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-black text-zinc-950">৳{product.price.toLocaleString()}</span>
                        {product.compareAtPrice && (
                            <span className="text-sm text-zinc-400 line-through font-bold">৳{product.compareAtPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <Link href={`/products/${product.slug}`} className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
