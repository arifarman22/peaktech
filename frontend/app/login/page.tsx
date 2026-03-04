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
    const { login } = useAuth();
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
        <div className="min-h-screen bg-[var(--color-bg-main)]">
            <Navbar />

            <div className="flex items-center justify-center p-6 pt-32 pb-20">
                <div className="bg-white border border-[var(--color-border)] rounded-lg p-8 md:p-10 w-full max-w-md shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
                            Sign In
                        </h1>
                        <p className="text-[var(--color-text-muted)] text-sm">Welcome back to PeakTech</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-[var(--color-border)] px-4 py-2.5 rounded-md text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none placeholder-[var(--color-text-muted)]"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-[var(--color-text-primary)]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-[var(--color-border)] px-4 py-2.5 rounded-md text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none placeholder-[var(--color-text-muted)]"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-md font-medium text-sm hover:bg-[var(--color-primary-hover)] transition-all shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-[var(--color-text-muted)]">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[var(--color-primary)] hover:underline font-medium">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center">
                        <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] text-sm transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
