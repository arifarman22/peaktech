'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 text-purple-600 rounded-full text-5xl mb-8 font-black">
                    404
                </div>
                <h1 className="text-5xl font-black text-gray-900 mb-6">Page Not Found</h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    href="/"
                    className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-black text-xl hover:shadow-2xl hover:scale-105 transition active:scale-95"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
