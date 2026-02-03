import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import Product from '../models/Product';
import Category from '../models/Category';

async function seedProducts() {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        // First, create categories
        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('Creating categories...');
            const newCategories = await Category.insertMany([
                { name: 'Electronics', slug: 'electronics' },
                { name: 'Machinery', slug: 'machinery' },
                { name: 'Tools', slug: 'tools' }
            ]);
            categories.push(...newCategories);
        }

        const electronicsId = categories.find(c => c.slug === 'electronics')?._id;
        const machineryId = categories.find(c => c.slug === 'machinery')?._id;
        const toolsId = categories.find(c => c.slug === 'tools')?._id;

        // Check if products already exist
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            console.log(`❌ ${existingProducts} products already exist. Skipping seed.`);
            process.exit(0);
        }

        // Sample products
        const products = [
            {
                name: 'Arduino Uno R3 Development Board',
                slug: 'arduino-uno-r3',
                description: 'Microcontroller board based on the ATmega328P with 14 digital I/O pins',
                price: 2500,
                compareAtPrice: 3000,
                quantity: 50,
                images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800'],
                category: electronicsId,
                status: 'active',
                featured: true,
                trending: true,
                topSeller: true
            },
            {
                name: 'Raspberry Pi 4 Model B 8GB',
                slug: 'raspberry-pi-4-8gb',
                description: 'High-performance single-board computer with 8GB RAM',
                price: 12000,
                compareAtPrice: 15000,
                quantity: 30,
                images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800'],
                category: electronicsId,
                status: 'active',
                trending: true,
                topSeller: true
            },
            {
                name: 'ESP32 WiFi Bluetooth Module',
                slug: 'esp32-wifi-bluetooth',
                description: 'Dual-core microcontroller with WiFi and Bluetooth connectivity',
                price: 800,
                quantity: 100,
                images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
                category: electronicsId,
                status: 'active',
                featured: true
            },
            {
                name: 'Industrial Servo Motor 5kg',
                slug: 'servo-motor-5kg',
                description: 'High-torque servo motor for industrial applications',
                price: 4500,
                compareAtPrice: 5500,
                quantity: 25,
                images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'],
                category: machineryId,
                status: 'active',
                topSeller: true
            },
            {
                name: 'CNC Router Machine Kit',
                slug: 'cnc-router-kit',
                description: 'Complete CNC router kit for precision cutting and engraving',
                price: 45000,
                compareAtPrice: 55000,
                quantity: 10,
                images: ['https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800'],
                category: machineryId,
                status: 'active',
                trending: true,
                featured: true
            },
            {
                name: 'Digital Multimeter Professional',
                slug: 'digital-multimeter',
                description: 'High-precision digital multimeter for electrical measurements',
                price: 3200,
                quantity: 40,
                images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'],
                category: toolsId,
                status: 'active',
                topSeller: true
            },
            {
                name: 'Soldering Station 60W',
                slug: 'soldering-station-60w',
                description: 'Temperature-controlled soldering station with digital display',
                price: 5500,
                compareAtPrice: 7000,
                quantity: 20,
                images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'],
                category: toolsId,
                status: 'active',
                featured: true
            },
            {
                name: 'LED Strip 5050 RGB 5M',
                slug: 'led-strip-rgb-5m',
                description: 'Waterproof RGB LED strip with remote control',
                price: 1800,
                quantity: 60,
                images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
                category: electronicsId,
                status: 'active',
                trending: true
            }
        ];

        await Product.insertMany(products);
        console.log(`✅ ${products.length} products seeded successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedProducts();
