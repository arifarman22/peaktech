'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/utils/api';

interface Address {
    label: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

interface Props {
    addresses: Address[];
    onUpdate: () => void;
}

export default function AddressManager({ addresses, onUpdate }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Address>({
        label: 'Home',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Bangladesh',
        isDefault: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedAddresses = editIndex !== null
                ? addresses.map((addr, i) => i === editIndex ? formData : addr)
                : [...addresses, formData];

            await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({ addresses: updatedAddresses }),
            });

            toast.success(editIndex !== null ? 'Address updated' : 'Address added');
            setShowForm(false);
            setEditIndex(null);
            onUpdate();
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    const deleteAddress = async (index: number) => {
        if (!confirm('Delete this address?')) return;
        try {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({ addresses: updatedAddresses }),
            });
            toast.success('Address deleted');
            onUpdate();
        } catch (error) {
            toast.error('Failed to delete address');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">Saved Addresses</h3>
                <button
                    onClick={() => { setShowForm(true); setEditIndex(null); }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500"
                >
                    + Add Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="p-12 bg-gray-50 rounded-2xl text-center">
                    <p className="text-gray-500 font-medium">No saved addresses</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {addresses.map((addr, i) => (
                        <div key={i} className="p-6 bg-white border border-gray-200 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">{addr.label}</span>
                                    {addr.isDefault && <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Default</span>}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setFormData(addr); setEditIndex(i); setShowForm(true); }} className="text-blue-600 text-sm font-bold">Edit</button>
                                    <button onClick={() => deleteAddress(i)} className="text-red-600 text-sm font-bold">Delete</button>
                                </div>
                            </div>
                            <p className="font-bold text-gray-900">{addr.fullName}</p>
                            <p className="text-sm text-gray-600">{addr.phone}</p>
                            <p className="text-sm text-gray-600 mt-2">{addr.address}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p className="text-sm text-gray-600">{addr.country}</p>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-black mb-6">{editIndex !== null ? 'Edit' : 'Add'} Address</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Label (Home/Office)" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="px-4 py-3 border rounded-xl" required />
                                <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="px-4 py-3 border rounded-xl" required />
                            </div>
                            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border rounded-xl" required />
                            <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border rounded-xl" rows={3} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="px-4 py-3 border rounded-xl" required />
                                <input type="text" placeholder="State/Division" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="px-4 py-3 border rounded-xl" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="px-4 py-3 border rounded-xl" required />
                                <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="px-4 py-3 border rounded-xl" required />
                            </div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
                                <span className="text-sm font-medium">Set as default address</span>
                            </label>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Address</button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border rounded-xl font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
