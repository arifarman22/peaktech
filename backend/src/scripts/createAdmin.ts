import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import connectDB from '../config/db';
import User from '../models/User';

const createAdmin = async () => {
    try {
        await connectDB();
        
        const email = 'admin@peaktech.com';
        const password = 'admin123456';
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({
            name: 'Admin',
            email,
            password: hashedPassword,
            role: 'admin',
            emailVerified: true,
            provider: 'credentials'
        });
        
        console.log('✅ Admin user created successfully');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
