'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#2D2D2D] text-white pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <img src="/logo.png?v=1" alt="PeakTech" className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Your trusted destination for quality electronics and industrial parts.
                        </p>
                        <div className="flex gap-3">
                            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 bg-gray-700 hover:bg-[var(--color-primary)] rounded flex items-center justify-center transition-colors"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current opacity-70" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2.5">
                            <li><FooterLink href="/shop">Shop</FooterLink></li>
                            <li><FooterLink href="/shop?category=electronics">Electronics</FooterLink></li>
                            <li><FooterLink href="/shop?category=machinery">Machinery</FooterLink></li>
                            <li><FooterLink href="/cart">Cart</FooterLink></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-white">Customer Service</h4>
                        <ul className="space-y-2.5">
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                            <li><FooterLink href="#">Shipping Info</FooterLink></li>
                            <li><FooterLink href="#">Returns</FooterLink></li>
                            <li><FooterLink href="#">FAQ</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-white">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe for updates and offers.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 bg-gray-700 border border-gray-600 px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-primary)] transition-colors rounded-l"
                            />
                            <button className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors rounded-r">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>© 2026 PeakTech. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors">
            {children}
        </Link>
    );
}
