import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  try {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    };

    await mongoose.connect(MONGODB_URI, opts);
    console.log('✅ MongoDB connected');
    return mongoose;
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

export default connectDB;
