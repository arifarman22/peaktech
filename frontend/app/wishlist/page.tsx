'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/utils/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
  quantity: number;
  trackQuantity: boolean;
}

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setProducts(res.data?.products || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart', { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">{products.length} {products.length === 1 ? 'item' : 'items'}</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items here</p>
            <Link href="/shop" className="inline-block px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Link href={`/products/${product.slug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">{product.category.name}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold mb-2 line-clamp-2 hover:text-purple-600 transition">{product.name}</h3>
                  </Link>
                  <p className="text-xl font-bold text-purple-600 mb-3">৳{product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.trackQuantity && product.quantity === 0}
                    className="w-full py-2.5 bg-black text-white font-bold rounded-lg hover:bg-purple-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {product.trackQuantity && product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
