'use client';

import Link from 'next/link';

const categories = [
    { name: 'Electronics', icon: '💻', slug: 'electronics', color: 'from-blue-500 to-cyan-500' },
    { name: 'Gadgets', icon: '🎧', slug: 'gadgets-accessories', color: 'from-purple-500 to-pink-500' },
    { name: 'Toys', icon: '🧸', slug: 'toys', color: 'from-pink-500 to-rose-500' },
    { name: 'Foods', icon: '🍜', slug: 'chinese-dry-foods', color: 'from-orange-500 to-amber-500' },
    { name: 'Tea', icon: '🍵', slug: 'tea', color: 'from-green-500 to-emerald-500' },
    { name: 'Cosmetics', icon: '💄', slug: 'cosmetics', color: 'from-red-500 to-pink-500' },
    { name: 'Cloths', icon: '👕', slug: 'cloths', color: 'from-indigo-500 to-purple-500' },
    { name: 'Shoes', icon: '👟', slug: 'shoes', color: 'from-slate-500 to-zinc-500' },
    { name: 'Bags', icon: '🎒', slug: 'bags', color: 'from-amber-500 to-yellow-500' },
    { name: 'Parts', icon: '⚙️', slug: 'parts', color: 'from-gray-500 to-slate-500' },
    { name: 'Gifts', icon: '🎁', slug: 'gift-items', color: 'from-rose-500 to-red-500' },
    { name: 'Drones', icon: '🛸', slug: 'drones', color: 'from-cyan-500 to-blue-500' },
    { name: 'Machinery', icon: '🚜', slug: 'machinery', color: 'from-yellow-500 to-orange-500' },
];

export default function CategorySlider() {
    return (
        <div className="relative py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Shop by Category</h2>
            </div>
            
            <div className="flex animate-marquee whitespace-nowrap gap-4">
                {[...categories, ...categories].map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/shop?category=${cat.slug}`}
                        className="inline-flex flex-col items-center gap-3 px-5 py-6 rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 group min-w-[130px] relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-2xl">{cat.icon}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 text-center relative z-10">
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
                    animation: marquee 35s linear infinite;
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
