'use client';

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/api";
import CategorySlider from "@/components/CategorySlider";
import BannerSlider from "@/components/BannerSlider";
import Footer from "@/components/Footer";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
}

const SAMPLE_PRODUCTS: Product[] = [
  { _id: '1', name: 'Ultra-HD Drone with 4K Camera', slug: 'hd-drone', price: 1299, images: ['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800'], category: { name: 'Drones' } },
  { _id: '2', name: 'Premium Matcha Green Tea', slug: 'matcha-tea', price: 45, images: ['https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&q=80&w=800'], category: { name: 'Tea' } },
  { _id: '3', name: 'Smart Noise Cancelling Headphones', slug: 'headphones', price: 350, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'], category: { name: 'Electronics' } },
  { _id: '4', name: 'Mechanical Industrial Drill', slug: 'industrial-drill', price: 4500, images: ['https://images.unsplash.com/photo-1504917595217-d4dc5f6497d7?auto=format&fit=crop&q=80&w=800'], category: { name: 'Machinery' } },
  { _id: '5', name: 'Organic Chinese Dry Dates', slug: 'dry-dates', price: 25, images: ['https://images.unsplash.com/photo-1593026848149-53b922116315?auto=format&fit=crop&q=80&w=800'], category: { name: 'Chinese Dry Foods' } },
];

export default function Home() {
  const [trending, setTrending] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [topSelling, setTopSelling] = useState<Product[]>(SAMPLE_PRODUCTS.slice(0, 3));

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await apiFetch('/products?featured=true&limit=8');
        const data = await res.json();
        if (data.success && data.data.products.length > 0) {
          setTrending(data.data.products);
        }
      } catch (error) {
        console.log("Using sample data - API not available");
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Slider Hero */}
      <div className="pt-24 lg:pt-0">
        <BannerSlider />
      </div>

      {/* Why PeakTech Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex gap-6 items-start">
              <span className="text-4xl">🚀</span>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-black">Priority Shipping</h3>
                <p className="text-gray-500 text-sm font-medium">Free global delivery on all premium orders over $500.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-4xl">🔐</span>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-black">Secure Payments</h3>
                <p className="text-gray-500 text-sm font-medium">Fully encrypted transactions and data protection.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-4xl">💎</span>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-black">Authentic Gear</h3>
                <p className="text-gray-500 text-sm font-medium">100% genuine products with manufacturer warranty.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Category Slider */}
      <CategorySlider />

      {/* Trending Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">New Arrivals</h2>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Latest from our global warehouse</p>
            </div>
            <Link href="/shop" className="text-black font-black uppercase text-[10px] tracking-widest hover:mr-2 transition-all border-b-2 border-black pb-1">Explore Shop →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-secondary flex items-center justify-center overflow-hidden relative border-y border-gray-100">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none text-[300px] font-black tracking-tighter select-none flex items-center justify-center whitespace-nowrap">
          PEAKTECH CIRCLE
        </div>
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">BE THE FIRST TO KNOW <br /><span className="text-gray-300">GET THE EDGE</span></h2>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              className="flex-grow bg-white border border-gray-100 rounded-full py-5 px-10 text-xs font-black outline-none shadow-sm focus:ring-2 focus:ring-black/5"
            />
            <button className="bg-black text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl active:scale-95">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-24 leading-tight">THE <br /><span className="text-gray-300 font-outline">TOP SELLERS</span></h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {topSelling.map((product) => (
              <Link key={product._id} href={`/products/${product.slug}`} className="group relative">
                <div className="aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden hover:shadow-2xl transition duration-500 mb-10 p-12 flex items-center justify-center">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" />
                </div>
                <div className="px-4 text-center sm:text-left">
                  <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-3">{product.category.name}</p>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-black transition">{product.name}</h4>
                  <p className="text-3xl font-black text-gray-900">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square bg-gray-50 rounded-[2.5rem] p-8 overflow-hidden hover:shadow-2xl transition-all duration-500 mb-6 flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
        />
        <div className="absolute bottom-6 right-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl">
          <span className="text-xl">+</span>
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{product.category.name}</p>
      <h3 className="font-bold text-gray-900 group-hover:text-black transition line-clamp-2 min-h-[3rem] text-lg">{product.name}</h3>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-2xl font-black text-gray-900">${product.price}</span>
      </div>
    </Link>
  );
}
