'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-light text-xl">
                                P
                            </div>
                            <span className="text-xl font-light tracking-tight">PeakTech</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-8 max-w-xs">
                            Quality electronics and industrial parts for professionals and enthusiasts.
                        </p>
                        <div className="flex gap-3">
                            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current opacity-20" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links - Shop */}
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-6">Collections</h4>
                        <ul className="space-y-3">
                            <li><FooterLink href="/shop?category=electronics">Electronics</FooterLink></li>
                            <li><FooterLink href="/shop?category=machinery">Machinery</FooterLink></li>
                            <li><FooterLink href="/shop?category=toys">Collectibles</FooterLink></li>
                            <li><FooterLink href="/shop?category=tea">Artisan Tea</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><FooterLink href="#">Shipping Info</FooterLink></li>
                            <li><FooterLink href="#">Returns & Exchanges</FooterLink></li>
                            <li><FooterLink href="#">Security Policy</FooterLink></li>
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-6">Sign up for updates and offers.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full bg-transparent border border-gray-700 py-3 px-4 text-sm text-white outline-none focus:border-white transition-all placeholder:text-gray-600"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                        © 2026 PeakTech. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-xs uppercase tracking-wider text-gray-500 hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="text-xs uppercase tracking-wider text-gray-500 hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
            {children}
        </Link>
    );
}
