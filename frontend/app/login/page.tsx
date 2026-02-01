'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
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
        <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="flex-grow flex items-center justify-center p-6 relative z-10 pt-32">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 md:p-16 w-full max-w-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/20 transform rotate-12">
                            <span className="text-white font-black text-4xl">P</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter italic">
                            WELCOME <span className="text-indigo-500">BACK.</span>
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[10px] uppercase font-black text-zinc-400 ml-1 tracking-[0.2em]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-[20px] font-bold text-sm text-white focus:border-indigo-500 focus:bg-white/10 transition-all outline-none placeholder-zinc-700"
                                placeholder="commander@peaktech.com"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[10px] uppercase font-black text-zinc-400 ml-1 tracking-[0.2em]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-[20px] font-bold text-sm text-white focus:border-indigo-500 focus:bg-white/10 transition-all outline-none placeholder-zinc-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-zinc-950 py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest">
                                <span className="px-4 bg-zinc-900 text-zinc-600">OR LOGIN WITH</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => signIn('google')}
                            className="w-full bg-white/5 border border-white/10 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 brightness-200" alt="Google" />
                            Sign in with Google
                        </button>
                    </form>

                    <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest">
                        <p className="text-zinc-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-indigo-500 hover:text-white transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 border-t border-white/5 pt-8 text-center">
                        <Link href="/" className="text-zinc-700 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                            ← Cancel and Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
