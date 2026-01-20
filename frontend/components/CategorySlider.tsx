'use client';

import Link from 'next/link';

const categories = [
    { name: 'Electronics', icon: '💻', slug: 'electronics' },
    { name: 'Gadgets & Accessories', icon: '🎧', slug: 'gadgets-accessories' },
    { name: 'Toys', icon: '🧸', slug: 'toys' },
    { name: 'Chinese Dry Foods', icon: '🍜', slug: 'chinese-dry-foods' },
    { name: 'Tea', icon: '🍵', slug: 'tea' },
    { name: 'Cosmetics', icon: '💄', slug: 'cosmetics' },
    { name: 'Cloths', icon: '👕', slug: 'cloths' },
    { name: 'Shoes', icon: '👟', slug: 'shoes' },
    { name: 'Bags', icon: '🎒', slug: 'bags' },
    { name: 'Parts', icon: '⚙️', slug: 'parts' },
    { name: 'Gift Items', icon: '🎁', slug: 'gift-items' },
    { name: 'Drones', icon: '🛸', slug: 'drones' },
    { name: 'Machinery', icon: '🚜', slug: 'machinery' },
];

export default function CategorySlider() {
    return (
        <div className="relative py-10 bg-white overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-8">
                {[...categories, ...categories].map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/shop?category=${cat.slug}`}
                        className="inline-flex flex-col items-center justify-center min-w-[120px] p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 hover:scale-105 transition-all group"
                    >
                        <span className="text-4xl mb-3 group-hover:scale-110 transition">{cat.icon}</span>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-700 group-hover:text-purple-600">
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
                    animation: marquee 30s linear infinite;
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
