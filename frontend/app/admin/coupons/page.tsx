'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
    isActive: boolean;
    expiryDate: string;
}

export default function AdminCouponsPage() {
    const { user, loading: authLoading } = useAuth();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountAmount: 0,
        minOrderAmount: 0,
        isActive: true,
        expiryDate: '',
    });

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchCoupons();
        }
    }, [user, authLoading]);

    const fetchCoupons = async () => {
        try {
            const data = await apiFetch('/admin/coupons');
            if (data.success) setCoupons(data.data);
        } catch (error) {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/admin/coupons/${currentId}` : '/admin/coupons';
            const method = isEditing ? 'PUT' : 'POST';
            const data = await apiFetch(url, { method, body: JSON.stringify(formData) });
            if (data.success) {
                toast.success('Coupon saved');
                fetchCoupons();
                resetForm();
            }
        } catch (error) { toast.error('Error saving coupon'); }
    };

    const resetForm = () => {
        setFormData({ code: '', discountType: 'percentage', discountAmount: 0, minOrderAmount: 0, isActive: true, expiryDate: '' });
        setIsEditing(false);
        setCurrentId(null);
    };

    if (authLoading || loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 font-display">Create Coupon</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code</label>
                                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 uppercase font-mono" placeholder="SALE20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                    <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Amount</label>
                                    <input type="number" value={formData.discountAmount} onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date</label>
                                <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                            </div>
                            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition">Save Coupon</button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Code</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Discount</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Expiry</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-mono font-bold text-purple-600">{coupon.code}</td>
                                        <td className="px-6 py-4 font-bold">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
