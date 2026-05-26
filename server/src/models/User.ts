import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'instructor' | 'admin';
    googleId?: string;
    avatar?: string;
    isVerified: boolean;
    isApproved: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateVerificationToken(): string;
    generatePasswordResetToken(): string;
}

const userSchema = new mongoose.Schema<IUser>({ // Changed to new mongoose.Schema and kept generic type
    name: {
        type: String,
        required: [true, 'Name is required'], // Kept original validation
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'], // Kept original validation
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: function (this: IUser) {
            return !this.googleId; // Password is required only if googleId is not present
        },
        minlength: [6, 'Password must be at least 6 characters long'], // Kept original validation
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to generate verification token
userSchema.methods.generateVerificationToken = function (): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function (): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return token;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
