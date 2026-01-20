'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 text-red-600 rounded-full text-5xl mb-8">
                    ⚠️
                </div>
                <h1 className="text-5xl font-black text-gray-900 mb-6">Something went wrong!</h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-10 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-50 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
