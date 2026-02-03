'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/utils/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    image?: string;
    phone?: string;
    addresses?: any[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (credential: any) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
    refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }
            
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }
            
            const res = await apiFetch('/auth/me');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setUser(data.data.user);
                }
            } else if (res.status === 401) {
                localStorage.removeItem('accessToken');
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || 'Login failed');
        }

        if (data.data.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.data.accessToken);
        }

        setUser(data.data.user);
        router.push('/');
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || 'Registration failed');
        }
    };

    const verifyOTP = async (email: string, otp: string) => {
        const res = await apiFetch('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || 'Verification failed');
        }

        if (data.data.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.data.accessToken);
        }

        setUser(data.data.user);
        router.push('/');
    };

    const googleLogin = async (userData: any) => {
        const res = await apiFetch('/auth/google', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (data.success) {
            if (data.data.accessToken && typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.data.accessToken);
            }
            setUser(data.data.user);
            router.push('/');
        } else {
            throw new Error(data.error || 'Google login failed');
        }
    };

    const logout = async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, googleLogin, register, verifyOTP, logout, refetch: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
