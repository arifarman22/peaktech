'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-accent)] text-white pt-20 pb-10 mt-20">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <img src="/logo.png?v=1" alt="PeakTech" className="h-12 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-white/80 leading-relaxed mb-8 max-w-xs">
                            Quality electronics and industrial parts for professionals and enthusiasts.
                        </p>
                        <div className="flex gap-3">
                            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white hover:text-[var(--color-primary)] transition-all"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current opacity-60" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links - Shop */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Collections</h4>
                        <ul className="space-y-3">
                            <li><FooterLink href="/shop?category=electronics">Electronics</FooterLink></li>
                            <li><FooterLink href="/shop?category=machinery">Machinery</FooterLink></li>
                            <li><FooterLink href="/shop?category=toys">Collectibles</FooterLink></li>
                            <li><FooterLink href="/shop?category=tea">Artisan Tea</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><FooterLink href="#">Shipping Info</FooterLink></li>
                            <li><FooterLink href="#">Returns & Exchanges</FooterLink></li>
                            <li><FooterLink href="#">Security Policy</FooterLink></li>
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Newsletter</h4>
                        <p className="text-white/80 text-sm mb-6">Get updates and exclusive offers.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-white transition-all placeholder:text-white/50"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-[var(--color-primary)] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-white/60">
                        © 2026 PeakTech. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm text-white/70 hover:text-white transition-all flex items-center gap-2 group">
            {children}
        </Link>
    );
}
