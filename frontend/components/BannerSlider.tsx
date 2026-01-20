'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const banners = [
    {
        id: 1,
        title: "ELEVATE YOUR TECH",
        subtitle: "Experience the next generation of electronics with PeakTech's curated collection.",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2000",
        link: "/shop?category=electronics",
        color: "bg-blue-50"
    },
    {
        id: 2,
        title: "PREMIUM TEA BLENDS",
        subtitle: "Finest organic tea leaves sourced directly from high-altitude gardens.",
        image: "https://images.unsplash.com/photo-1544782318-642fe27be1e5?auto=format&fit=crop&q=80&w=2000",
        link: "/shop?category=tea",
        color: "bg-green-50"
    },
    {
        id: 3,
        title: "INDUSTRIAL POWER",
        subtitle: "Robust machinery and precision parts for industrial excellence.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
        link: "/shop?category=machinery",
        color: "bg-orange-50"
    }
];

export default function BannerSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[70vh] w-full overflow-hidden bg-white">
            <div className="flex h-full transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {banners.map((banner) => (
                    <div key={banner.id} className={`relative min-w-full h-full flex items-center ${banner.color}`}>
                        <div className="absolute inset-0 z-0">
                            <img src={banner.image} className="w-full h-full object-cover opacity-30 mix-blend-multiply" alt={banner.title} />
                        </div>
                        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                            <div className="max-w-xl">
                                <span className="text-black font-black tracking-[0.3em] uppercase text-xs mb-4 block">New Season 2026</span>
                                <h2 className="text-5xl md:text-7xl font-black text-black mb-6 leading-tight">
                                    {banner.title}
                                </h2>
                                <p className="text-gray-600 text-lg mb-10 font-medium">
                                    {banner.subtitle}
                                </p>
                                <Link
                                    href={banner.link}
                                    className="inline-block px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 transition-all shadow-xl active:scale-95"
                                >
                                    Shop Collection
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1 transition-all duration-500 rounded-full ${current === idx ? 'w-12 bg-black' : 'w-4 bg-black/20'}`}
                    />
                ))}
            </div>
        </section>
    );
}
