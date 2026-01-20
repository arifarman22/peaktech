'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    link?: string;
    active: boolean;
    order: number;
}

export default function AdminBannersPage() {
    const { user, loading: authLoading } = useAuth();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '/shop',
        active: true,
        order: 0,
    });

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchBanners();
        }
    }, [user, authLoading]);

    const fetchBanners = async () => {
        try {
            const res = await apiFetch('/banners');
            const data = await res.json();
            if (data.success) {
                setBanners(data.data);
            }
        } catch (error) {
            toast.error('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/banners/${currentId}` : '/banners';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEditing ? 'Banner updated' : 'Banner created');
                fetchBanners();
                resetForm();
            } else {
                toast.error(data.error || 'Failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const deleteBanner = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await apiFetch(`/banners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Banner deleted');
                fetchBanners();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const editBanner = (banner: Banner) => {
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            imageUrl: banner.imageUrl,
            link: banner.link || '/shop',
            active: banner.active,
            order: banner.order,
        });
        setCurrentId(banner._id);
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', imageUrl: '', link: '/shop', active: true, order: 0 });
        setIsEditing(false);
        setCurrentId(null);
    };

    if (authLoading || loading) return <div className="p-20 text-center">Loading...</div>;
    if (user?.role !== 'admin') return <div className="p-20 text-center text-red-600">Unauthorized</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">{isEditing ? 'Edit Banner' : 'Create Banner'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-600 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-600 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-600 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Link</label>
                                <input type="text" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-600 transition" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-grow">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Order</label>
                                    <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-600 transition" />
                                </div>
                                <div className="flex items-end mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="w-5 h-5 rounded text-purple-600" />
                                        <span className="text-sm font-bold text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-grow bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition">
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Banner</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Order</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {banners.map((banner) => (
                                    <tr key={banner._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={banner.imageUrl} alt={banner.title} className="w-16 h-10 object-cover rounded-lg border border-gray-100" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{banner.title}</p>
                                                    <p className="text-xs text-gray-500">{banner.subtitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-bold">{banner.order}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${banner.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {banner.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <button onClick={() => editBanner(banner)} className="text-blue-600 font-bold hover:underline">Edit</button>
                                                <button onClick={() => deleteBanner(banner._id)} className="text-red-600 font-bold hover:underline">Delete</button>
                                            </div>
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
