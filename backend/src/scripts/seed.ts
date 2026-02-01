import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import Category from '../models/Category';
import Product from '../models/Product';

const seedData = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting seed...');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('🧹 Existing data cleared');

        // Create Categories
        const categories = await Category.insertMany([
            { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
            { name: 'Machinery', slug: 'machinery', description: 'Industrial and commercial machinery' },
            { name: 'Smartphones', slug: 'smartphones', description: 'Latest smartphones and mobile devices' },
            { name: 'Laptops', slug: 'laptops', description: 'High-performance laptops and notebooks' },
            { name: 'Tablets', slug: 'tablets', description: 'Tablets and iPad devices' },
            { name: 'Accessories', slug: 'accessories', description: 'Tech accessories and gadgets' },
            { name: 'Audio', slug: 'audio', description: 'Headphones, speakers, and audio equipment' },
            { name: 'Collectibles', slug: 'toys', description: 'Rare finds and collectibles' },
            { name: 'Artisan Tea', slug: 'tea', description: 'Premium loose leaf and artisan teas' },
        ]);
        console.log('✅ Categories created');

        // Create Sample Products
        const products = [
            {
                name: 'iPhone 15 Pro',
                slug: 'iphone-15-pro',
                description: 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
                price: 999,
                compareAtPrice: 1099,
                quantity: 50,
                category: categories[2]._id,
                status: 'active',
                featured: true,
                images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
                sizes: ['128GB', '256GB', '512GB', '1TB']
            },
            {
                name: 'MacBook Pro 16"',
                slug: 'macbook-pro-16',
                description: 'Powerful MacBook Pro with M3 Max chip, stunning Liquid Retina XDR display.',
                price: 2499,
                compareAtPrice: 2799,
                quantity: 30,
                category: categories[3]._id,
                status: 'active',
                featured: true,
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
                sizes: ['16GB RAM', '32GB RAM', '64GB RAM']
            },
            {
                name: 'iPad Pro 12.9"',
                slug: 'ipad-pro-12',
                description: 'Ultimate iPad experience with M2 chip and ProMotion display.',
                price: 1099,
                compareAtPrice: 1199,
                quantity: 40,
                category: categories[4]._id,
                status: 'active',
                featured: false,
                images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
                sizes: ['128GB', '256GB', '512GB', '1TB', '2TB']
            },
            {
                name: 'AirPods Pro',
                slug: 'airpods-pro',
                description: 'Active noise cancellation, adaptive audio, and personalized spatial audio.',
                price: 249,
                compareAtPrice: 279,
                quantity: 100,
                category: categories[6]._id,
                status: 'active',
                featured: true,
                images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500'],
                sizes: []
            },
            {
                name: 'Magic Keyboard',
                slug: 'magic-keyboard',
                description: 'Wireless keyboard with rechargeable battery and scissor mechanism.',
                price: 99,
                quantity: 75,
                category: categories[5]._id,
                status: 'active',
                featured: false,
                images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
                sizes: []
            },
        ];

        await Product.insertMany(products);
        console.log('✅ Products created');

        console.log('\n🎉 Seed completed successfully!');
        console.log(`📦 ${categories.length} categories created`);
        console.log(`📱 ${products.length} products created`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seedData();
