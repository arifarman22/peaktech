'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderSuccessPage() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-48 text-center">
                <div className="relative inline-block mb-12">
                    <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner border border-gray-100 animate-in zoom-in duration-700">
                        📦
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl shadow-2xl animate-bounce">
                        ✓
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">Gear Secured.</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] max-w-md mx-auto leading-relaxed">
                        We've received your order and our technicians are preparing your shipment for departure.
                    </p>

                    <div className="mt-12 p-8 bg-gray-50 rounded-[3rem] border border-gray-100 inline-block">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Tracking Identification</p>
                        <p className="font-mono text-lg font-bold text-black">{id}</p>
                    </div>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                    <Link href="/shop" className="flex-grow bg-black text-white py-6 rounded-full font-black text-sm uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition shadow-2xl">
                        Continue Shopping
                    </Link>
                    <Link href="/orders" className="flex-grow bg-white border-2 border-gray-100 text-black py-6 rounded-full font-black text-sm uppercase tracking-widest hover:border-black transition">
                        Manage Orders
                    </Link>
                </div>

                <p className="mt-12 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    A confirmation email has been dispatched
                </p>
            </main>

            <Footer />
        </div>
    );
}
