import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import Product from '../models/Product';

async function updateProductFlags() {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        // Get all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        if (products.length === 0) {
            console.log('No products to update');
            process.exit(0);
        }

        // Update first 2 products as trending
        if (products[0]) {
            await Product.findByIdAndUpdate(products[0]._id, { trending: true, featured: true });
            console.log(`✅ Set ${products[0].name} as trending and featured`);
        }
        if (products[1]) {
            await Product.findByIdAndUpdate(products[1]._id, { trending: true, topSeller: true });
            console.log(`✅ Set ${products[1].name} as trending and top seller`);
        }

        // Update next 2 as top sellers
        if (products[2]) {
            await Product.findByIdAndUpdate(products[2]._id, { topSeller: true, featured: true });
            console.log(`✅ Set ${products[2].name} as top seller and featured`);
        }
        if (products[3]) {
            await Product.findByIdAndUpdate(products[3]._id, { topSeller: true });
            console.log(`✅ Set ${products[3].name} as top seller`);
        }

        // Update remaining as featured
        for (let i = 4; i < products.length; i++) {
            await Product.findByIdAndUpdate(products[i]._id, { featured: true });
            console.log(`✅ Set ${products[i].name} as featured`);
        }

        console.log('✅ All products updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateProductFlags();
