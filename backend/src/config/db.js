const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctor_portal';

  try {
    console.log(`Connecting to primary MongoDB URI: ${uri}...`);
    // Connect with a short timeout so if local mongo isn't active we don't hang indefinitely
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (primaryError) {
    console.warn('⚠️  Could not connect to external MongoDB server:', primaryError.message);
    console.log('🔄 Initializing embedded in-memory MongoDB instance for automatic zero-config setup...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri();
      console.log(`🚀 In-memory MongoDB started at: ${memUri}`);

      await mongoose.connect(memUri);
      console.log('✅ Connected to In-Memory MongoDB successfully.');

      // Auto-seed if running on in-memory instance
      const { seedDatabase } = require('../seeds/seed');
      await seedDatabase(false);
    } catch (memError) {
      console.error('❌ Failed to launch in-memory MongoDB:', memError.message);
      console.warn('⚠️ Server will continue in mock-safe mode or retry when MongoDB becomes reachable.');
    }
  }
};

module.exports = connectDB;
