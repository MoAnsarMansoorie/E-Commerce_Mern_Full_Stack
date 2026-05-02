import mongoose from "mongoose"

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 seconds

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 60000,
            retryWrites: true,
            maxPoolSize: 10,
            family: 4, // Use IPv4
        })
        console.log(`✓ Database Connected Successfully with MongoDB`)
        retryCount = 0; // Reset on successful connection
    } catch (error) {
        console.error(`✗ MongoDB Connection Error: ${error.message}`)
        
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`\n📍 Retry attempt ${retryCount}/${MAX_RETRIES} in ${RETRY_DELAY/1000}s...`)
            console.log(`Troubleshooting steps:`)
            console.log(`1. Go to https://cloud.mongodb.com`)
            console.log(`2. Click "Network Access" in the sidebar`)
            console.log(`3. Click "Add IP Address"`)
            console.log(`4. Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)`)
            console.log(`5. Confirm the change\n`)
            
            setTimeout(() => connectDb(), RETRY_DELAY);
        } else {
            console.error(`\n✗ Failed to connect after ${MAX_RETRIES} attempts`)
            console.error(`Please verify:`)
            console.error(`1. Your IP is whitelisted in MongoDB Atlas Network Access`)
            console.error(`2. Your internet connection is stable`)
            console.error(`3. MONGODB_URI in .env is correct: ${process.env.MONGODB_URI}`)
            console.error(`4. MongoDB Atlas cluster is running`)
            process.exit(1)
        }
    }
}

export default connectDb;