'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center font-black text-2xl group-hover:rotate-12 transition duration-500">
                                P
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-black">PeakTech.</span>
                        </Link>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8 max-w-xs">
                            The definitive destination for premium electronics, industrial parts, and global delicacies. Quality curated for the modern world.
                        </p>
                        <div className="flex gap-4">
                            {['IG', 'TW', 'FB', 'LI'].map((social) => (
                                <div key={social} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-black hover:text-white transition-all">
                                    {social}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links - Shop */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shop?category=electronics" className="text-sm font-bold text-gray-600 hover:text-black transition">Electronics</Link></li>
                            <li><Link href="/shop?category=machinery" className="text-sm font-bold text-gray-600 hover:text-black transition">Machinery</Link></li>
                            <li><Link href="/shop?category=toys" className="text-sm font-bold text-gray-600 hover:text-black transition">Collectibles</Link></li>
                            <li><Link href="/shop?category=tea" className="text-sm font-bold text-gray-600 hover:text-black transition">Tea & Food</Link></li>
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-black transition">Order Tracking</Link></li>
                            <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-black transition">Returns & Exchanges</Link></li>
                            <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-black transition">Shipping Policy</Link></li>
                            <li><Link href="#" className="text-sm font-bold text-gray-600 hover:text-black transition">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Stay Ahead</h4>
                        <p className="text-gray-500 text-sm font-medium mb-6">Join our elite circle for early access and exclusive tech insights.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-50 border-none rounded-full py-4 px-6 pr-14 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transition"
                            />
                            <button className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition">
                                →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        © 2026 PEAKTECH ECOMMERCE. BUILT FOR EXCELLENCE.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black cursor-pointer transition">Privacy Policy</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black cursor-pointer transition">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
