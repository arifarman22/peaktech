'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Login successful!');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-400 to-pink-500 opacity-20 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="flex-grow flex items-center justify-center p-6 relative z-10 pt-32">
                <div className="bg-white backdrop-blur-2xl border border-orange-100 rounded-[40px] p-10 md:p-16 w-full max-w-xl shadow-[0_40px_80px_-20px_rgba(249,115,22,0.3)]">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/30 transform rotate-12">
                            <span className="text-white font-black text-4xl">P</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tighter">
                            WELCOME BACK
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[10px] uppercase font-black text-orange-600 ml-1 tracking-[0.2em]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-orange-50 border-2 border-orange-100 px-6 py-5 rounded-[20px] font-bold text-sm text-zinc-900 focus:border-orange-500 focus:bg-white transition-all outline-none placeholder-zinc-400"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[10px] uppercase font-black text-orange-600 ml-1 tracking-[0.2em]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-orange-50 border-2 border-orange-100 px-6 py-5 rounded-[20px] font-bold text-sm text-zinc-900 focus:border-orange-500 focus:bg-white transition-all outline-none placeholder-zinc-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:from-orange-600 hover:to-pink-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-orange-100"></div></div>
                            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest">
                                <span className="px-4 bg-white text-zinc-400">OR LOGIN WITH</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled
                            className="w-full bg-orange-50 border-2 border-orange-100 text-zinc-600 py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-orange-100 transition-all active:scale-[0.98] opacity-50 cursor-not-allowed"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                            Google Sign-in (Coming Soon)
                        </button>
                    </form>

                    <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest">
                        <p className="text-zinc-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-orange-600 hover:text-pink-600 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 border-t border-orange-100 pt-8 text-center">
                        <Link href="/" className="text-zinc-400 hover:text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
