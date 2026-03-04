import Link from 'next/link';
import { useState } from 'react';
import { apiFetch } from '@/lib/utils/api';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    category: { name: string; slug: string };
}

export default function ProductCard({ product }: { product: Product }) {
    const [isInWishlist, setIsInWishlist] = useState(false);

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });
            if (data.success) {
                toast.success('Added to cart');
            } else {
                toast.error(data.error || 'Failed to add');
            }
        } catch (error) {
            toast.error('Please login to add to cart');
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            if (isInWishlist) {
                await apiFetch(`/wishlist/${product._id}`, { method: 'DELETE' });
                setIsInWishlist(false);
            } else {
                await apiFetch('/wishlist', { method: 'POST', body: JSON.stringify({ productId: product._id }) });
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        }
    };

    const discount = product.compareAtPrice && product.compareAtPrice > product.price
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-[var(--color-primary)] text-white text-xs font-semibold px-2 py-1 rounded">
                            -{discount}%
                        </div>
                    )}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <svg className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-3">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">{product.category.name}</p>
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2 line-clamp-2 h-10 group-hover:text-[var(--color-primary)] transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-semibold text-[var(--color-primary)]">৳{product.price.toLocaleString()}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-[var(--color-text-muted)] line-through">৳{product.compareAtPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <button
                        onClick={addToCart}
                        className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
}
