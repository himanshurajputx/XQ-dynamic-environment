const mongoose = require('mongoose');
const { writeFileSync } = require('fs');
const dotenv = require('dotenv');
const  path = require('path');
dotenv.config();
async function fetchConfigurations() {
  const mongoURI = 'mongodb+srv://RFOneDB:UQGeGRsvmbqo1nsL@app-setting.gtnic6l.mongodb.net/?retryWrites=true&w=majority&appName=app-setting';

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { dbName: 'app_settings'});

    console.log('✅ MongoDB connected');

    const db = mongoose.connection.db;

    // Log available collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));

    const collection = db.collection('app_prefiin');

    const configs = await collection.find({}).toArray();

    return configs.map((config) => ({
      key: config.key,
      value: config.value,
    }));
  } catch (error) {
    console.error('❌ Error fetching configurations:', error);
    return [];
  } finally {
    await mongoose.disconnect(); // Cleanly disconnect
    console.log('⚠️ MongoDB disconnected');
  }
}

// Call the async function properly
fetchConfigurations().then((configs) => {
  // console.log('📦 Configurations:', configs);
  console.log(' 📦 Loading configuration from database...');

  let envContent = '';

  for (const config of configs) {
    envContent += `${config.key}=${config.value}\n`;
  }

  const envPath = path.resolve(
    process.cwd(),
    `./environment/${process.env.NODE_ENV}.env`,
  );

  writeFileSync(envPath, envContent);

  // Reload environment variables
  dotenv.config();
  console.log(" ✅ Environment loaded successfully");

});
