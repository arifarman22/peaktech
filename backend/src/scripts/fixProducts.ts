import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import dotenv from 'dotenv';

dotenv.config();

async function fixProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        const result = await Product.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'active' } }
        );

        console.log(`Updated ${result.modifiedCount} products with status field`);

        const allProducts = await Product.find({});
        console.log(`\nTotal products: ${allProducts.length}`);
        allProducts.forEach(p => {
            console.log(`- ${p.name}: status=${p.status}, trending=${p.trending}, topSeller=${p.topSeller}, featured=${p.featured}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixProducts();
