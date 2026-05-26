import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import User from '../models/User';

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        const email = process.argv[2];
        if (!email) {
            console.log('Usage: npx ts-node src/scripts/create-admin.ts <email>');
            console.log('  This will promote an existing user to admin, or create a new admin account.');
            process.exit(1);
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            existingUser.role = 'admin';
            await existingUser.save();
            console.log(`✅ User "${existingUser.name}" (${email}) promoted to admin!`);
        } else {
            const password = process.argv[3];
            if (!password || password.length < 8) {
                console.log('Usage: npx ts-node src/scripts/create-admin.ts <email> <password>');
                console.log('  Password must be at least 8 characters long.');
                process.exit(1);
            }
            const admin = await User.create({
                name: 'Admin',
                email,
                password,
                role: 'admin',
                isVerified: true
            });
            console.log(`✅ Admin account created: ${admin.email} (password: ${password})`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
