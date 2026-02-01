'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Category {
    _id: string;
    name: string;
}

export default function ProductFormPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [imageInput, setImageInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        compareAtPrice: '',
        quantity: '',
        category: '',
        status: 'active',
        featured: false,
        topSeller: false,
        trending: false,
        images: [] as string[],
        sizes: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await apiFetch('/categories');
        const data = await res.json();
        if (data.success) setCategories(data.data);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
        if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
        if (!/^[a-z0-9-]+$/.test(formData.slug)) newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = 'Quantity must be 0 or greater';
        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                
                reader.onloadend = async () => {
                    try {
                        const base64 = reader.result as string;
                        const res = await apiFetch('/admin/uploads', {
                            method: 'POST',
                            body: JSON.stringify({ file: base64, folder: 'peaktech/products' }),
                        });
                        
                        const data = await res.json();
                        if (data.success) {
                            setFormData(prev => ({ ...prev, images: [...prev.images, data.data.url] }));
                            if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
                            toast.success(`Image ${i + 1} uploaded`);
                        } else {
                            toast.error('Upload failed');
                        }
                    } catch (error) {
                        toast.error('Upload error');
                    }
                };
                
                reader.readAsDataURL(file);
            }
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const addImage = () => {
        if (imageInput.trim() && imageInput.startsWith('http')) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
            setImageInput('');
            if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
        } else {
            toast.error('Please enter a valid image URL');
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const addSize = () => {
        if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
            setFormData(prev => ({ ...prev, sizes: [...prev.sizes, sizeInput.trim()] }));
            setSizeInput('');
        }
    };

    const removeSize = (index: number) => {
        setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) {
            toast.error('Please fix all validation errors');
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiFetch('/products', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : 0,
                    quantity: Number(formData.quantity),
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Product created successfully');
                router.push('/admin/products');
            } else {
                toast.error(data.error || 'Failed to create product');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. iPhone 15 Pro"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. iphone-15-pro"
                        />
                        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Product description..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Price ($) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            className={`w-full px-4 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Compare at Price ($)</label>
                        <input
                            type="number"
                            name="compareAtPrice"
                            value={formData.compareAtPrice}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <label className="block text-sm font-medium mb-2">Available Sizes</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="e.g. S, M, L, XL"
                        />
                        <button type="button" onClick={addSize} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((size, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                                {size}
                                <button type="button" onClick={() => removeSize(i)} className="text-red-500 hover:text-red-700">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium mb-2">Product Images *</label>
                    
                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600">
                                    {uploading ? 'Uploading...' : 'Click to upload images from your PC'}
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* URL Input */}
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                            className={`flex-1 px-4 py-2 border rounded-lg ${errors.images ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Or enter image URL"
                        />
                        <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            Add URL
                        </button>
                    </div>
                    {errors.images && <p className="text-red-500 text-xs mb-2">{errors.images}</p>}
                    
                    {/* Image Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((img, i) => (
                            <div key={i} className="relative group">
                                <img src={img} alt="Product" className="w-full h-32 object-cover rounded-lg border" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 text-purple-600 rounded"
                        />
                        <label className="text-sm font-medium">Mark as Featured Product</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.topSeller}
                            onChange={(e) => setFormData(prev => ({ ...prev, topSeller: e.target.checked }))}
                            className="w-4 h-4 text-purple-600 rounded"
                        />
                        <label className="text-sm font-medium">Mark as Top Seller</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.trending}
                            onChange={(e) => setFormData(prev => ({ ...prev, trending: e.target.checked }))}
                            className="w-4 h-4 text-purple-600 rounded"
                        />
                        <label className="text-sm font-medium">Mark as Trending</label>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Creating Product...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}
