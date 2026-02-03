'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/utils/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressManager from '@/components/AddressManager';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{ name: string; price: number; quantity: number; image: string }>;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, pendingOrders: 0 });
  const [profileData, setProfileData] = useState({ name: '', phone: '', image: '', addresses: [] as any[] });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, phone: user.phone || '', image: user.image || '', addresses: user.addresses || [] });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (activeTab === 'orders' || activeTab === 'overview') fetchOrders();
  }, [user, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      const orderData = res.data?.orders || [];
      setOrders(orderData);
      setStats({
        totalOrders: orderData.length,
        totalSpent: orderData.reduce((sum: number, o: Order) => sum + o.total, 0),
        pendingOrders: orderData.filter((o: Order) => o.orderStatus === 'pending').length
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-40">
        <div className="flex flex-col gap-16">
          {/* Header */}
          <div className="relative p-12 md:p-16 rounded-[48px] bg-zinc-950 text-white overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-indigo-600/40 transition-colors duration-1000" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl font-black border border-white/20 shadow-2xl group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">User Profile</span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 italic">Greetings, {user.name}.</h1>
                <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats & Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-12 p-10 rounded-[40px] bg-zinc-950 border border-white/5 shadow-2xl">
              <nav className="flex flex-col gap-2">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'orders', label: 'My Orders', icon: '📦' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id
                      ? 'bg-white text-zinc-950 shadow-lg shadow-white/5 scale-[1.02]'
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className="text-lg grayscale group-hover:grayscale-0">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="h-px bg-zinc-100 w-full" />

              <button
                onClick={logout}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {activeTab === 'overview' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: 'Total Orders', value: stats.totalOrders, color: 'bg-zinc-950', icon: '📦' },
                      { label: 'Total Spent', value: `৳${stats.totalSpent.toLocaleString()}`, color: 'bg-zinc-950', icon: '💎' },
                      { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-zinc-950', icon: '⚡' }
                    ].map((s, i) => (
                      <div key={i} className={`${s.color} p-10 rounded-[32px] border border-white/5 shadow-2xl hover:shadow-white/5 transition-all duration-500`}>
                        <span className="text-3xl mb-4 block">{s.icon}</span>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{s.label}</p>
                        <p className="text-3xl font-black text-white tabular-nums">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-10">
                      <h2 className="text-2xl font-black tracking-tight italic">Recent Orders.</h2>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Orders</button>
                    </div>

                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-24 bg-zinc-50 rounded-2xl animate-pulse" />)}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="p-20 bg-zinc-50 rounded-[40px] text-center border-2 border-dashed border-zinc-100">
                        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">No orders found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-8 bg-zinc-50 border border-zinc-100 rounded-[32px] hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div>
                              <p className="font-black text-zinc-950 mb-1">{order.orderNumber}</p>
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-zinc-950 mb-2">৳{order.total.toLocaleString()}</p>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.orderStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                                order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-indigo-100 text-indigo-700'
                                }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-3xl font-black tracking-tight italic">Full Acquisition Log.</h2>
                  {orders.length === 0 ? (
                    <div className="p-32 bg-zinc-50 rounded-[48px] text-center border-2 border-dashed border-zinc-100">
                      <span className="text-6xl mb-8 block grayscale opacity-30">📂</span>
                      <h3 className="text-xl font-black mb-4 italic">No orders yet.</h3>
                      <Link href="/shop" className="inline-block px-10 py-5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-zinc-100 rounded-[48px] overflow-hidden bg-white hover:shadow-2xl transition-all duration-700 group">
                          <div className="bg-zinc-50 px-10 py-8 flex justify-between items-center border-b border-zinc-100">
                            <div>
                              <p className="font-black text-xl italic mb-1">{order.orderNumber}</p>
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Logged on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${order.orderStatus === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              order.orderStatus === 'processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                  'bg-zinc-100 text-zinc-700 border border-zinc-200'
                              }`}>
                              {order.orderStatus}
                            </span>
                          </div>

                          <div className="p-10 space-y-8">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-8">
                                <div className="w-24 h-24 bg-zinc-50 rounded-3xl flex-shrink-0 flex items-center justify-center p-4 border border-zinc-100 group-hover:bg-white transition-colors duration-500">
                                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-cover rounded-xl" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-black text-zinc-950 mb-1 leading-tight">{item.name}</p>
                                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-black text-lg tabular-nums text-zinc-950">৳{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>

                          <div className="bg-zinc-50 px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Subtotal</p>
                              <p className="font-bold text-sm">৳{order.subtotal.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">VAT & Logistics</p>
                              <p className="font-bold text-sm">৳{(order.tax + order.shippingCost).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Final Val</p>
                              <p className="font-black text-xl italic">৳{order.total.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-end">
                              {order.orderStatus === 'pending' && (
                                <button
                                  onClick={() => deleteOrder(order._id)}
                                  className="text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-100 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight italic mb-8">Profile Settings</h2>
                    <div className="p-10 bg-zinc-50 rounded-[32px] border border-zinc-100 space-y-8">
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-3xl overflow-hidden bg-zinc-100 border-4 border-white shadow-xl">
                            {profileData.image ? (
                              <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl font-black text-zinc-400">
                                {profileData.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setProfileData({ ...profileData, image: reader.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {profileData.image && (
                          <button
                            onClick={() => setProfileData({ ...profileData, image: '' })}
                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                          >
                            Remove Picture
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-8 py-5 border border-zinc-100 rounded-2xl bg-white font-bold text-zinc-950 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+880 1234567890"
                          className="w-full px-8 py-5 border border-zinc-100 rounded-2xl bg-white font-bold text-zinc-950 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-8 py-5 border border-zinc-100 rounded-2xl bg-gray-100 font-bold text-zinc-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await api.post('/auth/profile', { name: profileData.name, phone: profileData.phone, image: profileData.image });
                            toast.success('Profile updated');
                            window.location.reload();
                          } catch (error) {
                            toast.error('Update failed');
                          }
                        }}
                        className="w-full px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <AddressManager addresses={profileData.addresses} onUpdate={() => window.location.reload()} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
