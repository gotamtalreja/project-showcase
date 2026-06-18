import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // [FIX H-03] Add null check for db handle
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        const result = await db.collection('users').updateMany(
            { isVerified: { $ne: true } },
            { $set: { isVerified: true }, $unset: { verificationToken: '', verificationTokenExpires: '' } }
        );

        console.log(`Updated ${result.modifiedCount} user(s) to verified.`);

        await mongoose.disconnect();
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
