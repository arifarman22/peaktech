'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(name, email, password);
            toast.success('Account created successfully!');
            window.location.href = '/';
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
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

            <div className="flex-grow flex items-center justify-center p-6 relative z-10 pt-32 pb-20">
                <div className="bg-white backdrop-blur-2xl border border-pink-100 rounded-[40px] p-10 md:p-16 w-full max-w-xl shadow-[0_40px_80px_-20px_rgba(236,72,153,0.3)]">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-pink-500/30 transform -rotate-12">
                            <span className="text-white font-black text-4xl">P</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tighter">
                            JOIN US
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Create your account today</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="name" className="text-[10px] uppercase font-black text-pink-600 ml-1 tracking-[0.2em]">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-pink-50 border-2 border-pink-100 px-6 py-5 rounded-[20px] font-bold text-sm text-zinc-900 focus:border-pink-500 focus:bg-white transition-all outline-none placeholder-zinc-400"
                                placeholder="Your Full Name"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[10px] uppercase font-black text-pink-600 ml-1 tracking-[0.2em]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-pink-50 border-2 border-pink-100 px-6 py-5 rounded-[20px] font-bold text-sm text-zinc-900 focus:border-pink-500 focus:bg-white transition-all outline-none placeholder-zinc-400"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[10px] uppercase font-black text-pink-600 ml-1 tracking-[0.2em]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-pink-50 border-2 border-pink-100 px-6 py-5 rounded-[20px] font-bold text-sm text-zinc-900 focus:border-pink-500 focus:bg-white transition-all outline-none placeholder-zinc-400"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:from-pink-600 hover:to-purple-700 transition-all shadow-xl shadow-pink-500/20 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest">
                        <p className="text-zinc-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-pink-600 hover:text-purple-600 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 border-t border-pink-100 pt-8 text-center">
                        <Link href="/" className="text-zinc-400 hover:text-pink-600 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
