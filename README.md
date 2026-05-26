# Student Project Showcase Platform

A premium, full-stack web application built with **React** and **Express** for students to showcase their projects, admins to moderate content, and instructors to provide technical feedback.

## 🚀 Features

### 🌍 Public Access
- Browse all approved student projects.
- View detailed project information including:
  - YouTube video demonstrations.
  - Project descriptions and external links.
  - Group members and **Technologies** used.
  - Instructor feedback (transparency in evaluation).

### 🎓 Student Features
- **Dashboard**: Personal metrics for your project contributions.
- **Upload Projects**: Comprehensive project submission form including:
  - Project name, description, and group members.
  - Subject and **Technology** tagging.
  - YouTube video link and description links.
  - Instructor assignment.
- **Track Progress**: Real-time status updates (Pending/Approved/Rejected).

### 🏛 Instructor Features
- **Project Queue**: View only the projects assigned specifically to you.
- **Feedback System**: Add and update technical feedback on student projects.
- **Progress Tracking**: Monitor which projects still need your review.

### 🔑 Admin Features
- **Moderation**: Review every project before it goes public.
- **Instructor Approval**: Approve or reject instructor account registrations.
- **Full Overview**: Manage all users and projects from a central dashboard.

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite), TypeScript, Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB with Mongoose.
- **Security**: JWT Authentication, bcryptjs password hashing, Role-Based Access Control (RBAC).

## 📁 Project Structure

```
project-root/
├── docs/                   # Detailed documentation (Architecture, API, DB)
├── client/                 # React frontend
└── server/                # Express backend
```

## 📜 Detailed Documentation

For a deeper dive into the technical details, please refer to our documentation suite:

- 🏗 **[System Architecture](docs/ARCHITECTURE.md)**: High-level design and Mermaid diagrams.
- 🗄 **[Database Schema](docs/DATABASE.md)**: ER diagrams and model breakdowns.
- 📡 **[API Reference](docs/API_REFERENCE.md)**: Endpoints, methods, and role permissions.
- 📖 **[User & Setup Guide](docs/USER_GUIDE.md)**: Detailed installation and workflow guide.

## 🔧 Quick Start

1.  **Backend**: `cd server && npm install && npm run dev`
2.  **Frontend**: `cd client && npm install && npm run dev`

*See [User Guide](docs/USER_GUIDE.md) for full configuration details.*

## 🧪 Testing

1.  **Signup** as an Instructor (awaits Admin approval).
2.  **Signup** as a Student.
3.  **Upload** a project as a Student.
4.  **Approve** the project as an Admin.
5.  **Add Feedback** as an Instructor.

## 👨‍💻 Author

Built with ❤️ for students and educators.
