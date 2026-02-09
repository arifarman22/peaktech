'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[var(--color-primary)] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 bg-[var(--color-accent)] text-white rounded-[14px] flex items-center justify-center font-bold text-2xl group-hover:rotate-12 transition duration-500 premium-shadow">
                                P
                            </div>
                            <span className="text-2xl font-extrabold tracking-tighter">PeakTech</span>
                        </Link>
                        <p className="text-white/70 font-medium leading-relaxed mb-10 max-w-xs">
                            Curating excellence in digital craft, industrial precision, and artisan quality for the discerning global citizen.
                        </p>
                        <div className="flex gap-4">
                            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links - Shop */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-8">Collections</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="/shop?category=electronics">Electronics</FooterLink></li>
                            <li><FooterLink href="/shop?category=machinery">Machinery</FooterLink></li>
                            <li><FooterLink href="/shop?category=toys">Collectibles</FooterLink></li>
                            <li><FooterLink href="/shop?category=tea">Artisan Tea</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-8">Company</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="#">Shipping Info</FooterLink></li>
                            <li><FooterLink href="#">Returns & Exchanges</FooterLink></li>
                            <li><FooterLink href="#">Security Policy</FooterLink></li>
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-8">Newsletter</h4>
                        <p className="text-white/70 text-sm font-medium mb-8">Sign up for our newsletter to get the latest updates and offers.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-sm font-medium text-white outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-white/40"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-4 bg-[var(--color-accent)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-accent-hover)] transition-all active:scale-95">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        © 2026 PEAKTECH CORP. BUILT FOR EXCELLENCE.
                    </p>
                    <div className="flex gap-10">
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Privacy Privacy</Link>
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Terms Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-semibold text-white/70 hover:text-white transition-all flex items-center gap-2 group">
            <span className="w-0 h-px bg-[var(--color-accent)] transition-all duration-300 group-hover:w-4" />
            {children}
        </Link>
    );
}
