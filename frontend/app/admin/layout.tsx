'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[var(--color-bg-card)]"><div className="w-16 h-16 border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" /></div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/admin' },
    { icon: '📦', label: 'Products', href: '/admin/products' },
    { icon: '📂', label: 'Categories', href: '/admin/categories' },
    { icon: '🛒', label: 'Orders', href: '/admin/orders' },
    { icon: '🎫', label: 'Coupons', href: '/admin/coupons' },
    { icon: '🖼️', label: 'Banners', href: '/admin/banners' },
    { icon: '📤', label: 'Uploads', href: '/admin/uploads' },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg-card)]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[var(--color-primary)] text-white transition-all duration-300 flex flex-col shadow-xl`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-bold text-xl">P</div>
              <div>
                <h1 className="text-lg font-bold">PeakTech</h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl hover:text-[var(--color-accent)] transition">☰</button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                pathname === item.href ? 'bg-[var(--color-accent)] text-white shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 w-full transition font-medium"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-[var(--color-border)] px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Admin Panel</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-text-muted)] font-medium">Welcome, <span className="text-[var(--color-primary)] font-bold">{user.name}</span></span>
            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
