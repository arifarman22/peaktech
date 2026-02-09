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
            <div className="bg-[#0A2540] text-white py-2 text-xs font-medium text-center fixed top-0 left-0 right-0 z-[60]">
                Free Shipping on Orders ৳5,000+ • 🎉 New Year Sale - Up to 50% Off!
            </div>

            {/* Main Navbar */}
            <nav
                className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'top-0' : ''
                    }`}
            >
                <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-4 transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-gray-200 ${scrolled ? 'shadow-lg' : ''}`}>

                    {/* Left: Logo & Links */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-[#0A2540] text-white rounded-lg flex items-center justify-center font-bold text-lg transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                                P
                            </div>
                            <span className="text-lg font-bold tracking-tight text-[#0A2540] hidden sm:block">PeakTech</span>
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
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 px-4 pl-10 focus:bg-white focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] outline-none transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
                            />
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#2EC4B6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <div className="w-9 h-9 bg-[#2EC4B6] rounded-full flex items-center justify-center text-white font-bold border-2 border-[#2EC4B6] group-hover:bg-[#26A69A] transition-all">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <button onClick={() => logout()} className="text-xs font-medium text-gray-500 hover:text-[#0A2540] transition-colors">Logout</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#0A2540] px-3 py-2 transition-colors">Sign In</Link>
                                    <Link href="/register" className="px-4 py-2 bg-[#2EC4B6] text-white text-sm font-medium rounded-lg hover:bg-[#26A69A] transition-all shadow-lg">Sign Up</Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 h-8 ml-2">
                            <Link href="/wishlist" className="relative p-2 text-[#0A2540] hover:text-[#2EC4B6] hover:bg-gray-50 rounded-lg transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>
                            <Link href="/cart" className="relative p-2 text-[#0A2540] hover:text-[#2EC4B6] hover:bg-gray-50 rounded-lg transition-all group">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-[#2EC4B6] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button className="lg:hidden p-2 text-[#0A2540]" onClick={() => setMobileMenuOpen(true)}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] transition-all">
                    <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl p-8 flex flex-col gap-10 animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-zinc-900">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <MobileNavLink href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</MobileNavLink>
                            <MobileNavLink href="/shop?category=electronics" onClick={() => setMobileMenuOpen(false)}>Electronics</MobileNavLink>
                            <MobileNavLink href="/shop?category=machinery" onClick={() => setMobileMenuOpen(false)}>Machinery</MobileNavLink>
                        </div>

                        <div className="mt-auto pt-8 border-t border-zinc-200 flex flex-col gap-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                        <div className="w-12 h-12 bg-[#0A2540] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-[#0A2540] truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="w-full bg-[#2EC4B6] text-white text-center py-4 rounded-xl font-medium text-sm transition-transform active:scale-95 hover:bg-[#26A69A]" onClick={() => setMobileMenuOpen(false)}>
                                        {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                                    </Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-gray-500 font-medium text-sm hover:text-[#0A2540] transition-colors">Logout</button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" className="w-full bg-[#2EC4B6] text-white text-center py-4 rounded-xl font-medium text-sm block transition-transform active:scale-95 hover:bg-[#26A69A]" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link href="/register" className="w-full bg-white text-[#0A2540] border-2 border-[#0A2540] text-center py-4 rounded-xl font-medium text-sm block transition-transform active:scale-95 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
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
            className="text-sm font-medium text-gray-600 hover:text-[#2EC4B6] transition-all relative group py-1"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2EC4B6] transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-2xl font-bold text-[#0A2540] hover:text-[#2EC4B6] transition-all"
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
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-200">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#0A2540] text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
                        P
                    </div>
                    <span className="text-lg font-bold tracking-tight text-[#0A2540] hidden sm:block">PeakTech</span>
                </Link>
            </div>
        </nav>
    );
}
