'use client';

import { useState, useEffect } from 'react';
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
    images: string[];
    createdAt: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await apiFetch('/products?limit=100');
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
            const data = await apiFetch(`/products/${id}`, { method: 'DELETE' });
            if (data.success) {
                toast.success('Product deleted');
                fetchProducts();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
                    + Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border">
                    <p className="text-gray-500 mb-4">No products yet</p>
                    <Link href="/admin/products/new" className="text-purple-600 font-medium hover:underline">
                        Create your first product
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.images?.[0] && (
                                                <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                            )}
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm">{product.quantity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <Link href={`/admin/products/edit/${product._id}`} className="text-blue-600 hover:underline text-sm font-medium">Edit</Link>
                                            <button onClick={() => deleteProduct(product._id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
