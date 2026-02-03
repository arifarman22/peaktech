'use client';

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/api";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/QuickViewModal";
import BannerSlider from "@/components/BannerSlider";
import CategorySlider from "@/components/CategorySlider";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: { _id: string; name: string; slug: string };
  description: string;
  quantity: number;
  sizes?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trending' | 'best-sellers'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    fetchCategories();
    fetchTrending();
    fetchBestSellers();
    fetchTopRated();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedFilter, selectedCategory, priceRange]);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.log("Error fetching categories");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products?limit=24';
      if (selectedFilter === 'trending') url += '&trending=true';
      if (selectedFilter === 'best-sellers') url += '&topSeller=true';
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const res = await apiFetch(url);
      const data = await res.json();
      if (data.success) {
        const filtered = data.data.products.filter((p: Product) =>
          p.price >= priceRange[0] && p.price <= priceRange[1]
        );
        setProducts(filtered);
      }
    } catch (error) {
      console.log("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await apiFetch('/products?trending=true&limit=8');
      const data = await res.json();
      if (data.success) setTrendingProducts(data.data.products);
    } catch (error) {
      console.log("Error fetching trending");
    }
  };

  const fetchBestSellers = async () => {
    try {
      const res = await apiFetch('/products?topSeller=true&limit=8');
      const data = await res.json();
      if (data.success) setBestSellers(data.data.products);
    } catch (error) {
      console.log("Error fetching best sellers");
    }
  };

  const fetchTopRated = async () => {
    try {
      const res = await apiFetch('/products?featured=true&limit=8');
      const data = await res.json();
      if (data.success) setTopRated(data.data.products);
    } catch (error) {
      console.log("Error fetching top rated");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-0">
        <BannerSlider />

        <CategorySlider />

        {/* Section: Trending */}
        {trendingProducts.length > 0 && (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-end justify-between mb-12">
                <div className="max-w-md">
                  <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">Trending Now</h2>
                  <p className="text-zinc-600 font-medium">Discover the most sought-after products define current tech culture.</p>
                </div>
                <Link href="/shop?trending=true" className="group flex items-center gap-2 text-orange-600 font-bold text-sm tracking-widest uppercase pb-1 border-b-2 border-orange-600/10 hover:border-orange-600 transition-all">
                  View Curated List
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {trendingProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section: Feature Banner */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="relative h-[400px] rounded-[32px] overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000')] bg-cover bg-center opacity-20" />
              <div className="relative z-20 h-full flex flex-col justify-center px-12 md:px-20 max-w-2xl">
                <span className="text-orange-200 font-black uppercase tracking-[0.2em] text-[10px] mb-6">Expertise Defined</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">PRECISION PARTS FOR INDUSTRIAL CRAFT.</h2>
                <p className="text-white/80 text-lg mb-10 font-medium">We engineering solutions that power high-performance machinery across global industries.</p>
                <Link href="/shop?category=machinery" className="inline-flex h-14 items-center justify-center px-10 rounded-2xl bg-white text-orange-600 font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-all w-fit shadow-xl">
                  Explore Machinery
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-end justify-between mb-12">
                <div className="max-w-md">
                  <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">Elite Best Sellers</h2>
                  <p className="text-zinc-600 font-medium">The definitive collection of our most reliable and high-performance essentials.</p>
                </div>
                <Link href="/shop?topSeller=true" className="group flex items-center gap-2 text-pink-600 font-bold text-sm tracking-widest uppercase pb-1 border-b-2 border-pink-600/10 hover:border-pink-600 transition-all">
                  Show All
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {bestSellers.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section: Philosophy */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: "DIGITAL MASTERY", desc: "Curating only the most sophisticated electronic components that define the modern landscape.", icon: "M12 2v20m10-10H2", color: "from-orange-500 to-pink-500" },
                { title: "GLOBAL LOGISTICS", desc: "Our network ensures your high-performance parts reach you with precision and velocity.", icon: "M5 13l4 4L19 7", color: "from-pink-500 to-purple-500" },
                { title: "AUTHENTIC CRAFT", desc: "Direct sourcing from artisans ensure the heritage of every product is preserved.", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "from-purple-500 to-orange-500" }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                  <p className="text-zinc-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Main Explore */}
        <section className="py-24 border-t border-orange-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16 flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Curated Explorer</h2>
              <div className="flex gap-4">
                <div className="h-px w-32 bg-orange-200 mt-3 hidden md:block" />
                <p className="text-sm font-medium text-zinc-400">{products.length} Items Indexed</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-16">
              <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-40 space-y-12 p-10 rounded-[40px] bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100 shadow-2xl">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-8">Categories</h3>
                    <div className="space-y-2">
                      <FilterButton
                        active={selectedFilter === 'all' && !selectedCategory}
                        onClick={() => { setSelectedFilter('all'); setSelectedCategory(''); }}
                      >
                        All Indices
                      </FilterButton>
                      <FilterButton
                        active={selectedFilter === 'trending'}
                        onClick={() => { setSelectedFilter('trending'); setSelectedCategory(''); }}
                      >
                        Trending Now
                      </FilterButton>
                      <FilterButton
                        active={selectedFilter === 'best-sellers'}
                        onClick={() => { setSelectedFilter('best-sellers'); setSelectedCategory(''); }}
                      >
                        Best Sellers
                      </FilterButton>
                      <div className="h-4" />
                      {categories.map((cat) => (
                        <FilterButton
                          key={cat._id}
                          active={selectedCategory === cat._id}
                          onClick={() => { setSelectedFilter('all'); setSelectedCategory(cat._id); }}
                        >
                          {cat.name}
                        </FilterButton>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-8">Price Range</h3>
                    <div className="space-y-1">
                      {[
                        { label: 'All Spectrum', range: [0, 100000] },
                        { label: '৳0 - ৳5,000', range: [0, 5000] },
                        { label: '৳5,000 - ৳20,000', range: [5000, 20000] },
                        { label: '৳20,000+', range: [20000, 100000] }
                      ].map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setPriceRange(p.range as [number, number])}
                          className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${priceRange[0] === p.range[0] && priceRange[1] === p.range[1]
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                            : 'text-zinc-600 hover:text-orange-600 hover:bg-white'
                            }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-zinc-100 rounded-3xl mb-6" />
                        <div className="h-4 bg-zinc-100 rounded w-1/3 mb-4" />
                        <div className="h-6 bg-zinc-100 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-[32px]">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No products found in this spectrum</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] ${active
        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
        : 'text-zinc-600 hover:text-orange-600 hover:bg-white'
        }`}
    >
      {children}
    </button>
  );
}

function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (product: Product) => void }) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (isInWishlist) {
        await apiFetch(`/wishlist/${product._id}`, { method: 'DELETE' });
        setIsInWishlist(false);
      } else {
        await apiFetch('/wishlist', { method: 'POST', body: JSON.stringify({ productId: product._id }) });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  return (
    <div className="group">
      <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white mb-6 transform transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(249,115,22,0.3)] group-hover:-translate-y-2 border border-orange-100">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <button
            onClick={toggleWishlist}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:bg-white active:scale-90 border border-orange-100"
          >
            <svg className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-orange-600'}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 shadow-xl hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 hover:text-white active:scale-90 border border-orange-100"
          >
            <svg className="w-5 h-5 text-orange-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <div className="absolute bottom-6 left-6 font-black text-[10px] bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
          </div>
        )}
      </div>
      <div className="px-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{product.category.name}</span>
          <div className="h-px flex-grow bg-orange-100" />
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-zinc-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors duration-300 h-10">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">৳{product.price.toLocaleString()}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through font-bold">৳{product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-orange-600 transition-colors">Details →</button>
        </div>
      </div>
    </div>
  );
}
