'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/utils/api';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
            const res = await apiFetch('/cart');
            const data = await res.json();
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

                {/* Left: Logo & Core Links */}
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl group-hover:bg-purple-600 transition duration-300">
                            P
                        </div>
                        <span className="text-xl font-bold tracking-tight text-black">PeakTech</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <NavLink href="/shop">Store</NavLink>
                        <NavLink href="/shop?category=electronics">Electronics</NavLink>
                        <NavLink href="/shop?category=machinery">Machinery</NavLink>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex flex-grow max-w-md">
                    <form onSubmit={handleSearch} className="relative w-full group">
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 px-6 pl-12 focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* User */}
                    <div className="hidden sm:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/admin" className="text-sm font-bold text-gray-600 hover:text-black transition">
                                    {user.role === 'admin' ? 'Dashboard' : 'Account'}
                                </Link>
                                <button onClick={() => logout()} className="text-[10px] font-black uppercase tracking-widest text-red-500">Log out</button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-black transition">Sign In</Link>
                        )}
                    </div>

                    {/* Cart Button */}
                    <Link href="/cart" className="relative p-2.5 bg-black text-white rounded-full hover:scale-105 active:scale-95 transition shadow-lg group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white group-hover:animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>

                {/* Mobile Slide-over Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl p-8 flex flex-col gap-10 animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400">Close ×</button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <Link href="/shop" className="text-2xl font-bold" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
                                <Link href="/shop?category=electronics" className="text-2xl font-bold text-gray-500" onClick={() => setMobileMenuOpen(false)}>Electronics</Link>
                                <Link href="/shop?category=machinery" className="text-2xl font-bold text-gray-500" onClick={() => setMobileMenuOpen(false)}>Machinery</Link>
                            </div>

                            <div className="mt-auto border-t pt-10">
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <p className="font-bold">Hello, {user.name}</p>
                                        <Link href="/cart" className="w-full bg-black text-white text-center py-4 rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>My Cart</Link>
                                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 font-bold text-left">Log out</button>
                                    </div>
                                ) : (
                                    <Link href="/login" className="w-full bg-black text-white text-center py-4 rounded-xl font-bold block" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm font-bold text-gray-500 hover:text-black transition-all relative group py-2"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
        </Link>
    );
}
