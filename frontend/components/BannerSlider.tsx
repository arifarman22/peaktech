'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const banners = [
    {
        id: 1,
        title: "ELEVATE YOUR DIGITAL WORLD",
        subtitle: "Uncompromising quality. The next frontier of premium electronics curated for the modern minimalist.",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2000",
        link: "/shop?category=electronics",
        tag: "Digital Excellence"
    },
    {
        id: 2,
        title: "PURE ARTISAN HARVEST",
        subtitle: "Journey through high-altitude gardens with our selection of rare, artisanal organic tea blends.",
        image: "https://images.unsplash.com/photo-1544782318-642fe27be1e5?auto=format&fit=crop&q=80&w=2000",
        link: "/shop?category=tea",
        tag: "Heritage Craft"
    },
    {
        id: 3,
        title: "INDUSTRIAL PRECISION",
        subtitle: "Engineering excellence defined. High-performance machinery and parts for specialized industrial applications.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
        link: "/shop?category=machinery",
        tag: "Pro Series"
    }
];

export default function BannerSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-zinc-950">
            {banners.map((banner, idx) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${current === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                >
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={banner.image}
                        className="w-full h-full object-cover"
                        alt={banner.title}
                    />

                    <div className="absolute inset-0 z-20 flex items-center">
                        <div className="max-w-7xl mx-auto px-8 w-full">
                            <div className="max-w-2xl">
                                <span className={`inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 transform transition-all duration-700 delay-300 ${current === idx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}>
                                    {banner.tag}
                                </span>
                                <h1 className={`text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight transform transition-all duration-1000 delay-500 ${current === idx ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                                    }`}>
                                    {banner.title}
                                </h1>
                                <p className={`text-white/70 text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-lg transform transition-all duration-1000 delay-700 ${current === idx ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}>
                                    {banner.subtitle}
                                </p>
                                <div className={`transform transition-all duration-1000 delay-900 ${current === idx ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                    }`}>
                                    <Link
                                        href={banner.link}
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-white text-zinc-900 text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-100 transition-all premium-shadow group"
                                    >
                                        Explore Collection
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-12 right-12 flex items-center gap-6 z-30">
                <div className="flex gap-2">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${current === idx ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>
                <div className="text-white/40 text-[10px] font-black tracking-widest uppercase tabular-nums">
                    0{current + 1} / 0{banners.length}
                </div>
            </div>
        </section>
    );
}
