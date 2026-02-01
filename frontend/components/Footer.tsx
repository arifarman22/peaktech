'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-[14px] flex items-center justify-center font-bold text-2xl group-hover:rotate-12 transition duration-500 premium-shadow">
                                P
                            </div>
                            <span className="text-2xl font-extrabold tracking-tighter">PeakTech</span>
                        </Link>
                        <p className="text-zinc-400 font-medium leading-relaxed mb-10 max-w-xs">
                            Curating excellence in digital craft, industrial precision, and artisan quality for the discerning global citizen.
                        </p>
                        <div className="flex gap-4">
                            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-300"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links - Shop */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Collections</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="/shop?category=electronics">Electronics</FooterLink></li>
                            <li><FooterLink href="/shop?category=machinery">Machinery</FooterLink></li>
                            <li><FooterLink href="/shop?category=toys">Collectibles</FooterLink></li>
                            <li><FooterLink href="/shop?category=tea">Artisan Tea</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Company</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="#">Shipping Info</FooterLink></li>
                            <li><FooterLink href="#">Returns & Exchanges</FooterLink></li>
                            <li><FooterLink href="#">Security Policy</FooterLink></li>
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Newsletter</h4>
                        <p className="text-zinc-400 text-sm font-medium mb-8">Sign up for our newsletter to get the latest updates and offers.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-medium outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        © 2026 PEAKTECH CORP. BUILT FOR EXCELLENCE.
                    </p>
                    <div className="flex gap-10">
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">Privacy Privacy</Link>
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">Terms Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-semibold text-zinc-400 hover:text-white transition-all flex items-center gap-2 group">
            <span className="w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-4" />
            {children}
        </Link>
    );
}
