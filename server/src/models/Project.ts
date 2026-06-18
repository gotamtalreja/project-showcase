import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    projectName: string;
    groupMembers: string[];
    subject: string;
    technologies: string[];
    youtubeLink: string;
    descriptionLink: string;
    studentId: mongoose.Types.ObjectId;
    instructorId: mongoose.Types.ObjectId;
    instructorFeedback?: string;
    likes: mongoose.Types.ObjectId[];
    status: 'pending' | 'approved' | 'rejected';
    adminRemarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema(
    {
        projectName: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            minlength: [3, 'Project name must be at least 3 characters long']
        },
        groupMembers: {
            type: [String],
            required: [true, 'At least one group member is required'],
            validate: {
                validator: function (members: string[]) {
                    return members.length > 0;
                },
                message: 'At least one group member must be provided'
            }
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true
        },
        technologies: {
            type: [String],
            required: [true, 'At least one technology is required'],
            validate: {
                validator: function (technologies: string[]) {
                    return technologies.length > 0;
                },
                message: 'At least one technology must be provided'
            }
        },
        youtubeLink: {
            type: String,
            required: [true, 'YouTube link is required'],
            trim: true,
            match: [
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                'Please provide a valid YouTube URL'
            ]
        },
        descriptionLink: {
            type: String,
            required: [true, 'Description link is required'],
            trim: true,
            match: [
                /^https?:\/\/.+/,
                'Please provide a valid URL'
            ]
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student ID is required']
        },
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Instructor ID is required']
        },
        instructorFeedback: {
            type: String,
            default: '',
            trim: true
        },
        likes: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: []
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        adminRemarks: {
            type: String,
            default: '',
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
projectSchema.index({ studentId: 1 });
projectSchema.index({ instructorId: 1 });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
