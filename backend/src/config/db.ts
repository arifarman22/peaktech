import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

let isConnected = false;

async function connectDB(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log('✅ MongoDB connected');
    return mongoose;
  } catch (error: any) {
    isConnected = false;
    console.error('❌ MongoDB connection failed:', error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

export default connectDB;
