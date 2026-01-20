'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Product {
    _id: string;
    name: string;
    price: number;
    status: string;
    quantity: number;
    category: { name: string };
    createdAt: string;
}

export default function AdminProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchProducts();
        }
    }, [user, authLoading]);

    const fetchProducts = async () => {
        try {
            const res = await apiFetch('/products?limit=100'); // Admin might want more
            const data = await res.json();
            if (data.success) {
                setProducts(data.data.products);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await apiFetch(`/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Product deleted');
                setProducts(products.filter(p => p._id !== id));
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    if (authLoading || loading) return <div className="p-20 text-center">Loading...</div>;
    if (user?.role !== 'admin') return <div className="p-20 text-center text-red-600">Unauthorized</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black text-gray-900">Manage Products</h1>
                    <Link href="/admin/products/new" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition">
                        Add New Product
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Product</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Category</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Price</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Stock</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                                        <td className="px-6 py-4 font-bold">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">{product.quantity}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <Link href={`/admin/products/edit/${product._id}`} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Edit</Link>
                                                <button onClick={() => deleteProduct(product._id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Delete</button>
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
