'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Get In Touch</h1>
                        <p className="text-gray-600 text-lg">Have questions? We'd love to hear from you.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                            <p className="text-gray-600 text-sm mb-3">Send us an email anytime</p>
                            <a href="mailto:support@peaktech.com" className="text-[#4F46E5] font-semibold hover:underline">support@peaktech.com</a>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                            <p className="text-gray-600 text-sm mb-3">Mon-Fri from 9am to 6pm</p>
                            <a href="tel:+8801234567890" className="text-[#7C3AED] font-semibold hover:underline">+880 1234 567 890</a>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
                            <p className="text-gray-600 text-sm mb-3">Come say hello</p>
                            <p className="text-gray-700 font-semibold">Dhaka, Bangladesh</p>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-8 text-white">
                                <h2 className="text-3xl font-bold mb-2">Send us a message</h2>
                                <p className="text-indigo-100">Fill out the form below and we'll get back to you as soon as possible.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#4F46E5] transition"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#4F46E5] transition"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#4F46E5] transition"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#4F46E5] transition resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white py-4 rounded-xl font-bold text-lg hover:from-[#4338CA] hover:to-[#6D28D9] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'What are your shipping times?', a: 'We typically ship orders within 1-2 business days. Delivery takes 3-7 business days depending on your location.' },
                                { q: 'Do you offer international shipping?', a: 'Currently, we only ship within Bangladesh. International shipping will be available soon.' },
                                { q: 'What is your return policy?', a: 'We offer a 7-day return policy for most items. Products must be unused and in original packaging.' },
                                { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email to monitor your delivery.' }
                            ].map((faq, i) => (
                                <details key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <summary className="font-bold text-gray-900 cursor-pointer">{faq.q}</summary>
                                    <p className="text-gray-600 mt-3">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
