import mongoose from "mongoose";

async function connectToDB() {
    try {
        const { connection } = await mongoose.connect(process.env.MONGODB_URI);

        if (connection) {
            console.log(`✅ Connected to MongoDB: ${connection.host}`);
        }
    } catch (error) {
        console.error("❌ Error Connecting to DB");
        process.exit(1);
    }
}

export default connectToDB