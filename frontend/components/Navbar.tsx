'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { apiFetch } from '@/lib/utils/api';

function NavbarContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleScroll = () => setScrolled(window.scrollY > 20);
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [user]);

    const fetchCartCount = async () => {
        try {
            const data = await apiFetch('/cart');
            if (data.success) {
                const count = data.data.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
                setCartCount(count);
            }
        } catch (error) {
            console.error("Cart fetch error");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-black text-white py-2 text-xs text-center fixed top-0 left-0 right-0 z-[60] tracking-wide">
                Free Shipping on Orders ৳5,000+ • New Year Sale - Up to 50% Off
            </div>

            {/* Main Navbar */}
            <nav
                className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'top-0' : ''
                    }`}
            >
                <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-4 transition-all duration-300 bg-white border-b border-gray-200 ${scrolled ? 'shadow-sm' : ''}`}>

                    {/* Left: Logo & Links */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-light text-lg">
                                P
                            </div>
                            <span className="text-lg font-light tracking-tight text-black hidden sm:block">PeakTech</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <NavLink href="/shop">Shop</NavLink>
                            <NavLink href="/shop?category=electronics">Electronics</NavLink>
                            <NavLink href="/shop?category=machinery">Machinery</NavLink>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex flex-grow max-w-md">
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-300 py-2 px-4 pl-10 focus:border-black outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                            />
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 md:gap-5">
                        <div className="hidden sm:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-light border border-black">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <button onClick={() => logout()} className="text-xs text-gray-500 hover:text-black transition-colors">Logout</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="text-sm text-gray-600 hover:text-black px-3 py-2 transition-colors">Sign In</Link>
                                    <Link href="/register" className="px-4 py-2 bg-black text-white text-sm hover:bg-[#333333] transition-all">Sign Up</Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 h-8 ml-2">
                            <Link href="/wishlist" className="relative p-2 text-black hover:bg-gray-50 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>
                            <Link href="/cart" className="relative p-2 text-black hover:bg-gray-50 transition-all group">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-xs font-light flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button className="lg:hidden p-2 text-black" onClick={() => setMobileMenuOpen(true)}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] transition-all">
                    <div className="absolute inset-0 bg-black/10" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-lg p-8 flex flex-col gap-10">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-light text-black">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 hover:text-black transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <MobileNavLink href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</MobileNavLink>
                            <MobileNavLink href="/shop?category=electronics" onClick={() => setMobileMenuOpen(false)}>Electronics</MobileNavLink>
                            <MobileNavLink href="/shop?category=machinery" onClick={() => setMobileMenuOpen(false)}>Machinery</MobileNavLink>
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-200 flex flex-col gap-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-light text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-normal text-black truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="w-full bg-black text-white text-center py-4 font-normal text-sm transition-all hover:bg-[#333333]" onClick={() => setMobileMenuOpen(false)}>
                                        {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                                    </Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-gray-500 font-normal text-sm hover:text-black transition-colors">Logout</button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" className="w-full bg-black text-white text-center py-4 font-normal text-sm block transition-all hover:bg-[#333333]" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link href="/register" className="w-full bg-white text-black border border-black text-center py-4 font-normal text-sm block transition-all hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm text-gray-600 hover:text-black transition-all relative group py-1"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-2xl font-light text-black hover:text-gray-600 transition-all"
        >
            {children}
        </Link>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<NavbarFallback />}>
            <NavbarContent />
        </Suspense>
    );
}

function NavbarFallback() {
    return (
        <nav className="fixed top-10 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-4 bg-white border-b border-gray-200">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-light text-lg">
                        P
                    </div>
                    <span className="text-lg font-light tracking-tight text-black hidden sm:block">PeakTech</span>
                </Link>
            </div>
        </nav>
    );
}
