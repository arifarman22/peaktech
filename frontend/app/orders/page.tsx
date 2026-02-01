'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/utils/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete record');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Syncing Archives</span>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-40">
        <div className="flex flex-col gap-16">
          <div className="border-b border-zinc-100 pb-12">
            <span className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Central Repository</span>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter mb-0 italic uppercase">Logistics.</h1>
          </div>

          {orders.length === 0 ? (
            <div className="p-32 bg-zinc-50 rounded-[48px] text-center border-2 border-dashed border-zinc-100">
              <span className="text-6xl mb-8 block grayscale opacity-30">📂</span>
              <h3 className="text-xl font-black mb-4 italic">No acquisitions found.</h3>
              <Link href="/shop" className="inline-block px-10 py-5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all">Start Collection</Link>
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order) => (
                <div key={order._id} className="group relative bg-white border border-zinc-100 rounded-[48px] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-10 bg-zinc-50/50 border-b border-zinc-100">
                    <div>
                      <h3 className="font-black text-xl italic mb-2">{order.orderNumber}</h3>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Logged on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          order.status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                'bg-red-100 text-red-700 border-red-200'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 space-y-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-zinc-50 rounded-3xl flex-shrink-0 flex items-center justify-center p-4 border border-zinc-100 group-hover:bg-white transition-colors duration-500">
                          <img src={item.image} alt={item.name} className="max-h-full max-w-full object-cover rounded-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-zinc-950 mb-1 leading-tight">{item.name}</p>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Unit Grid: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                        </div>
                        <p className="font-black text-lg tabular-nums text-zinc-950">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center px-10 py-10 bg-zinc-50/50 border-t border-zinc-100">
                    <div className="flex items-end gap-2 mb-6 sm:mb-0">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Asset Value</span>
                      <p className="text-3xl font-black italic tabular-nums">৳{order.total.toLocaleString()}</p>
                    </div>
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="px-8 py-4 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all premium-shadow active:scale-95"
                      >
                        Abort Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
