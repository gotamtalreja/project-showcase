import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'new_project' | 'project_approved' | 'project_rejected' | 'new_instructor' | 'project_assigned';
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['new_project', 'project_approved', 'project_rejected', 'new_instructor', 'project_assigned'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
