import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-showcase';

async function migrateSkillsToTechnologies() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        const collection = db.collection('projects');

        // Rename the 'skills' field to 'technologies' in all documents
        const result = await collection.updateMany(
            { skills: { $exists: true } },
            { $rename: { skills: 'technologies' } }
        );

        console.log(`Migration complete: ${result.modifiedCount} project(s) updated (skills → technologies).`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateSkillsToTechnologies();
