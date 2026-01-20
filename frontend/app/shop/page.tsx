'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/utils/api';
import { ProductSkeleton } from '@/components/Skeletons';
import Footer from '@/components/Footer';

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

interface Category {
    _id: string;
    name: string;
    slug: string;
}

const SAMPLE_PRODUCTS: Product[] = [
    { _id: '1', name: 'Ultra-HD Drone with 4K Camera', slug: 'hd-drone', description: 'Professional drone', price: 1299, images: ['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800'], category: { name: 'Drones', slug: 'drones' }, quantity: 10 },
    { _id: '2', name: 'Premium Matcha Green Tea', slug: 'matcha-tea', description: 'Organic tea', price: 45, images: ['https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&q=80&w=800'], category: { name: 'Tea', slug: 'tea' }, quantity: 50 },
    { _id: '3', name: 'Smart Noise Cancelling Headphones', slug: 'headphones', description: 'Tech accessory', price: 350, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'], category: { name: 'Electronics', slug: 'electronics' }, quantity: 15 },
    { _id: '4', name: 'Mechanical Industrial Drill', slug: 'industrial-drill', description: 'Heavy machinery', price: 4500, images: ['https://images.unsplash.com/photo-1504917595217-d4dc5f6497d7?auto=format&fit=crop&q=80&w=800'], category: { name: 'Machinery', slug: 'machinery' }, quantity: 5 },
    { _id: '5', name: 'Organic Chinese Dry Dates', slug: 'dry-dates', description: 'Healthy snack', price: 25, images: ['https://images.unsplash.com/photo-1593026848149-53b922116315?auto=format&fit=crop&q=80&w=800'], category: { name: 'Chinese Dry Foods', slug: 'chinese-dry-foods' }, quantity: 100 },
];

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
    const [categories, setCategories] = useState<Category[]>([]);
    const [banners, setBanners] = useState<{ imageUrl: string, title: string, subtitle?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    const currentCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        fetchCategories();
        fetchActiveBanners();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentCategory, searchQuery, page, minPrice, maxPrice]);

    const fetchCategories = async () => {
        try {
            const res = await apiFetch('/categories');
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) { }
    };

    const fetchActiveBanners = async () => {
        try {
            const res = await apiFetch('/banners/active');
            const data = await res.json();
            if (data.success) setBanners(data.data);
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

            const res = await apiFetch(url);
            const data = await res.json();
            if (data.success && data.data.products.length > 0) {
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
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Shop Header */}
                <div className="mb-20">
                    <h1 className="text-6xl font-black mb-4">THE <span className="text-purple-600">COLLECTION</span></h1>
                    <p className="text-gray-500 font-medium">Browse through our meticulously curated list of premium goods.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-32 space-y-12">
                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Filter by Category</h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => { setPage(1); router.push('/shop'); }}
                                        className={`group flex items-center justify-between w-full text-left font-black transition-all ${!currentCategory ? 'text-purple-600' : 'text-gray-900 hov:text-purple-600'}`}
                                    >
                                        <span>ALL ITEMS</span>
                                        {!currentCategory && <span className="w-2 h-2 bg-purple-600 rounded-full" />}
                                    </button>
                                    {[
                                        'Electronics', 'Gadgets & Accessaries', 'Toys', 'Chinese dry foods',
                                        'Tea', 'Cosmetics', 'cloths', 'Shoes', 'bags', 'Parts',
                                        'Gift items', 'Drones', 'Machinery'
                                    ].map((catName) => {
                                        const slug = catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                                        return (
                                            <button
                                                key={catName}
                                                onClick={() => { setPage(1); router.push(`/shop?category=${slug}`); }}
                                                className={`group flex items-center justify-between w-full text-left font-black transition-all ${currentCategory === slug ? 'text-purple-600' : 'text-gray-900 hover:text-purple-600'}`}
                                            >
                                                <span className="uppercase">{catName}</span>
                                                {currentCategory === slug && <span className="w-2 h-2 bg-purple-600 rounded-full" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Slider UI */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Price range</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-gray-400">Min $</label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => { setPage(1); setMinPrice(e.target.value); }}
                                            className="w-full bg-gray-50 border-none px-4 py-3 rounded-2xl font-bold focus:ring-2 focus:ring-purple-600 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-gray-400">Max $</label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }}
                                            className="w-full bg-gray-50 border-none px-4 py-3 rounded-2xl font-bold focus:ring-2 focus:ring-purple-600 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Promo Card */}
                            <div className="bg-purple-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
                                <span className="text-5xl opacity-20 absolute top-4 right-4 animate-pulse">✨</span>
                                <h4 className="text-2xl font-black mb-4">First <br />Purchase?</h4>
                                <p className="text-purple-100 font-medium mb-8 text-sm">Use code PEAK10 for 10% off your first luxury order.</p>
                                <button className="bg-white text-black px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition hover:scale-105 active:scale-95">Copy Code</button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-gray-100 aspect-square rounded-[3rem]" />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24 bg-gray-50 rounded-[3rem]">
                                <span className="text-6xl mb-6 block">🔍</span>
                                <h3 className="text-2xl font-black mb-2">No items found</h3>
                                <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
                                    {products.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product.slug}`}
                                            className="group block"
                                        >
                                            <div className="relative aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden mb-6 p-10 transition duration-500 group-hover:bg-white group-hover:shadow-2xl group-hover:border group-hover:border-gray-100 flex items-center justify-center">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                                                />
                                                <div className="absolute top-8 left-8">
                                                    <span className="bg-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-purple-600 shadow-sm">{product.category.name}</span>
                                                </div>
                                            </div>
                                            <div className="px-4">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition mb-2">{product.name}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-black text-gray-900">${product.price}</span>
                                                    {product.compareAtPrice && (
                                                        <span className="text-gray-400 line-through font-bold text-sm">${product.compareAtPrice}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-24 flex justify-center gap-4">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => p - 1)}
                                            className="px-8 py-4 rounded-full border border-gray-200 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition disabled:opacity-30"
                                        >
                                            Prev
                                        </button>
                                        <div className="flex items-center px-6 font-black uppercase text-[10px] tracking-widest">
                                            Page {page} / {totalPages}
                                        </div>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            className="px-8 py-4 rounded-full border border-gray-200 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition disabled:opacity-30"
                                        >
                                            Next
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
