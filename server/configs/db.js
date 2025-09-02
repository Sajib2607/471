
import mongoose from "mongoose";


const connectDB = async () =>{
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not set');
        }

        mongoose.set('strictQuery', true);
        // Avoid silent buffering while disconnected
        mongoose.set('bufferCommands', false);

        mongoose.connection.on('connected', ()=> console.log("Database connected"));
        mongoose.connection.on('error', (err)=> console.error('MongoDB connection error:', err.message));
        mongoose.connection.on('disconnected', ()=> console.warn('MongoDB disconnected'));

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        throw error;
    }
}

export default connectDB;