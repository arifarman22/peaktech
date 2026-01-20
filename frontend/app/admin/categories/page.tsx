'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
}

export default function AdminCategoriesPage() {
    const { user, loading: authLoading } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchCategories();
        }
    }, [user, authLoading]);

    const fetchCategories = async () => {
        try {
            const res = await apiFetch('/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/categories/${currentId}` : '/categories';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEditing ? 'Category updated' : 'Category created');
                fetchCategories();
                resetForm();
            } else {
                toast.error(data.error || 'Failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Category deleted');
                fetchCategories();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const editCategory = (cat: Category) => {
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
        });
        setCurrentId(cat._id);
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '' });
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
                        <h2 className="text-2xl font-black text-gray-900 mb-6">{isEditing ? 'Edit Category' : 'Create Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
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
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Slug</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <button onClick={() => editCategory(cat)} className="text-blue-600 font-bold hover:underline">Edit</button>
                                                <button onClick={() => deleteCategory(cat._id)} className="text-red-600 font-bold hover:underline">Delete</button>
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
