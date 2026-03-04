'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/utils/api';
import toast from 'react-hot-toast';

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!email) router.push('/register');
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter complete OTP');
            return;
        }

        setLoading(true);
        try {
            const data = await apiFetch('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email, otp: otpCode }),
            });

            if (data.success) {
                localStorage.setItem('token', data.data.accessToken);
                toast.success('Email verified successfully!');
                router.push('/');
            } else {
                toast.error(data.error || 'Invalid OTP');
            }
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            const data = await apiFetch('/auth/resend-otp', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            if (data.success) {
                toast.success('OTP sent successfully!');
                setOtp(['', '', '', '', '', '']);
            } else {
                toast.error(data.error || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-light text-xl">
                            P
                        </div>
                        <span className="text-xl font-light">PeakTech</span>
                    </Link>
                    <h1 className="text-3xl font-light mb-2 mt-8">Verify Your Email</h1>
                    <p className="text-gray-600">
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-black">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-3 justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-light border border-gray-300 focus:border-black outline-none transition-colors"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full bg-black text-white py-3 hover:bg-[#333333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-sm text-black hover:underline disabled:opacity-40"
                        >
                            {resending ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/register" className="text-sm text-gray-600 hover:text-black">
                        ← Back to Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
