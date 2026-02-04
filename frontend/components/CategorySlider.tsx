'use client';

import Link from 'next/link';

const categories = [
    { name: 'Electronics', icon: '💻', slug: 'electronics' },
    { name: 'Gadgets', icon: '🎧', slug: 'gadgets-accessories' },
    { name: 'Toys', icon: '🧸', slug: 'toys' },
    { name: 'Foods', icon: '🍜', slug: 'chinese-dry-foods' },
    { name: 'Tea', icon: '🍵', slug: 'tea' },
    { name: 'Cosmetics', icon: '💄', slug: 'cosmetics' },
    { name: 'Cloths', icon: '👕', slug: 'cloths' },
    { name: 'Shoes', icon: '👟', slug: 'shoes' },
    { name: 'Bags', icon: '🎒', slug: 'bags' },
    { name: 'Parts', icon: '⚙️', slug: 'parts' },
    { name: 'Gifts', icon: '🎁', slug: 'gift-items' },
    { name: 'Drones', icon: '🛸', slug: 'drones' },
    { name: 'Machinery', icon: '🚜', slug: 'machinery' },
];

export default function CategorySlider() {
    return (
        <div className="relative py-12 bg-white overflow-hidden border-y border-zinc-100/60">
            <div className="flex animate-marquee whitespace-nowrap gap-6 py-4">
                {[...categories, ...categories].map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/shop?category=${cat.slug}`}
                        className="inline-flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all group min-w-[140px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-300">
                            <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{cat.icon}</span>
                        </div>
                        <span className="text-sm font-bold text-zinc-900 tracking-tight text-center">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                    display: inline-flex;
                    width: max-content;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
