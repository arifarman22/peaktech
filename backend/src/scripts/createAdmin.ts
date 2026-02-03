import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        const adminEmail = 'admin@peaktech.com';
        const adminPassword = 'admin123456';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('❌ Admin user already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            emailVerified: true,
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createAdmin();
