'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';
import { useState } from 'react';

export default function ProfilePage() {
    const { user, loading, refetch } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Profile updated');
                refetch();
            } else {
                toast.error(data.error || 'Update failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (!user) return <div className="p-20 text-center">Please login</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-black text-gray-900 mb-10">My Profile</h1>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-4xl font-black">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-gray-500">{user.role.toUpperCase()} ACCOUNT</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input type="email" value={formData.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>

                        <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition disabled:opacity-50">
                            {submitting ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
