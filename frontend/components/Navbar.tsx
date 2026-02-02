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
        <>
            {/* Announcement Bar */}
            <div className="bg-zinc-950 text-indigo-400 py-1.5 text-[11px] font-black tracking-[0.3em] text-center uppercase fixed top-0 left-0 right-0 z-[60] border-b border-white/5">
                Free Shipping on Orders ৳5,000+ • 🎉 New Year Sale - Up to 50% Off!
            </div>

            {/* Main Navbar */}
            <nav
                className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 ${scrolled ? 'py-2' : 'py-4'
                    }`}
            >
                <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-3 rounded-2xl transition-all duration-500 bg-zinc-950/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${scrolled ? 'translate-y-2' : ''}`}>

                    {/* Left: Logo & Links */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-[14px] flex items-center justify-center font-bold text-xl transform group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                                P
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white hidden sm:block italic">PeakTech</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <NavLink href="/shop">Store</NavLink>
                            <NavLink href="/shop?category=electronics">Electronics</NavLink>
                            <NavLink href="/shop?category=machinery">Machinery</NavLink>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex flex-grow max-w-sm">
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-4 pl-10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 outline-none transition-all text-sm font-medium text-white placeholder-zinc-500"
                            />
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 md:gap-5">
                        <div className="hidden sm:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 group">
                                        <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-white font-black border border-white/10 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-all">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <button onClick={() => logout()} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors">Abort</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white px-3 py-2 transition-colors">Sign In</Link>
                                    <Link href="/register" className="px-5 py-2.5 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5">Join</Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 border-l border-white/10 pl-4 h-8 ml-2">
                            <Link href="/wishlist" className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>
                            <Link href="/cart" className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-zinc-950">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button className="lg:hidden p-2 text-zinc-400" onClick={() => setMobileMenuOpen(true)}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] transition-all">
                    <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-zinc-950 border-l border-white/10 shadow-2xl p-8 flex flex-col gap-10 animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-black text-white italic">Explore.</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <MobileNavLink href="/shop" onClick={() => setMobileMenuOpen(false)}>Store</MobileNavLink>
                            <MobileNavLink href="/shop?category=electronics" onClick={() => setMobileMenuOpen(false)}>Electronics</MobileNavLink>
                            <MobileNavLink href="/shop?category=machinery" onClick={() => setMobileMenuOpen(false)}>Machinery</MobileNavLink>
                        </div>

                        <div className="mt-auto pt-8 border-t border-zinc-100 flex flex-col gap-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-black text-white truncate">{user.name}</p>
                                            <p className="text-[10px] font-black text-zinc-500 truncate uppercase tracking-widest">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="w-full bg-white text-zinc-950 text-center py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-transform active:scale-95" onClick={() => setMobileMenuOpen(false)}>
                                        {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                                    </Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-red-400 transition-colors">Abort Mission</button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" className="w-full bg-white text-zinc-950 text-center py-4 rounded-xl font-black uppercase text-xs tracking-widest block transition-transform active:scale-95" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link href="/register" className="w-full bg-white/5 text-white border border-white/10 text-center py-4 rounded-xl font-black uppercase text-xs tracking-widest block transition-transform active:scale-95" onClick={() => setMobileMenuOpen(false)}>Join Repo</Link>
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
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all relative group py-1"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full rounded-full" />
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-4xl font-black text-white hover:text-indigo-400 transition-all italic tracking-tighter uppercase"
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
        <nav className="fixed top-8 left-0 right-0 z-50 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-3 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-[14px] flex items-center justify-center font-bold text-xl">
                        P
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white hidden sm:block italic">PeakTech</span>
                </Link>
            </div>
        </nav>
    );
}
