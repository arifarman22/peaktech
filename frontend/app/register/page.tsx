'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/utils/api';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });

            if (data.success) {
                toast.success('OTP sent to your email!');
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-6 pt-32 pb-20">
                <div className="bg-white border border-[var(--color-border)] p-10 md:p-16 w-full max-w-xl">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-8">
                            <span className="text-white font-light text-3xl">P</span>
                        </div>
                        <h1 className="text-3xl font-light text-black mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 text-sm">Join PeakTech today</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs uppercase text-gray-600 tracking-wider">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white border border-gray-300 px-4 py-3 text-sm text-black focus:border-black transition-all outline-none placeholder-gray-400"
                                placeholder="Your Full Name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs uppercase text-gray-600 tracking-wider">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-gray-300 px-4 py-3 text-sm text-black focus:border-black transition-all outline-none placeholder-gray-400"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs uppercase text-gray-600 tracking-wider">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-gray-300 px-4 py-3 text-sm text-black focus:border-black transition-all outline-none placeholder-gray-400"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-[#333333] transition-all disabled:opacity-40"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-black hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                        <Link href="/" className="text-gray-600 hover:text-black text-sm transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
