'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Category {
    _id: string;
    name: string;
}

export default function ProductFormPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params.id;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: 0,
        compareAtPrice: 0,
        quantity: 0,
        category: '',
        status: 'active',
        featured: false,
        images: [] as string[],
    });

    useEffect(() => {
        if (!authLoading && user?.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchCategories();
        if (isEdit) fetchProduct();
    }, [user, authLoading]);

    const fetchCategories = async () => {
        const res = await apiFetch('/categories');
        const data = await res.json();
        if (data.success) setCategories(data.data);
    };

    const fetchProduct = async () => {
        try {
            const res = await apiFetch(`/products/id/${params.id}`);
            const data = await res.json();
            if (data.success) {
                setFormData({
                    ...data.data,
                    category: data.data.category?._id || data.data.category,
                });
            }
        } catch (error) {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as any).checked : (name === 'price' || name === 'compareAtPrice' || name === 'quantity' ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = isEdit ? `/products/${params.id}` : '/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEdit ? 'Product updated' : 'Product created');
                router.push('/admin/products');
            } else {
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-black text-gray-900 mb-10">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="e.g. iPhone 15 Pro" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="e.g. iphone-15-pro" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="Tell us about the product..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Compare at Price ($)</label>
                            <input type="number" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition">
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition">
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Image URLs (comma separated)</label>
                            <input
                                type="text"
                                value={formData.images.join(', ')}
                                onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition"
                                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            />
                            {formData.images.length > 0 && (
                                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={img} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pt-8">
                            <input type="checkbox" name="featured" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="w-5 h-5 text-purple-600 rounded" />
                            <label className="font-bold text-gray-700">Mark as Featured</label>
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition disabled:opacity-50">
                        {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
