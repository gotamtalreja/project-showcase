# User & Setup Guide

This guide describes how to set up the **Student Project Showcase Platform** and provides a walkthrough of user flows for different roles.

## 🛠 Setup & Installation

### Prerequisites
- **Node.js**: v18 or later.
- **MongoDB**: A running instance (local or Atlas).
- **Google Client ID**: For Google OAuth (optional, but recommended).

### 1. Backend Setup
1. Enter the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Run in development: `npm run dev`

### 2. Frontend Setup
1. Enter the client folder: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file (set `VITE_API_URL` to `http://localhost:5000/api`).
4. Start dev server: `npm run dev`

---

## 👥 User Roles & Permissions

### 🎓 Students
- **Upload Projects**: Share your work with the world.
- **Group Management**: Add your peers to your project.
- **Track Status**: See if your project is pending, approved, or rejected.
- **Feedback**: View technical feedback from assigned instructors.

### 🏛 Instructors
- **Dashboard**: View only the projects assigned to you.
- **Review**: Provide technical feedback to students.
- **Approval Workflow**: You review projects *after* they have been approved by an Admin.

### 🔑 Admins
- **Moderation**: Approve or Reject projects to ensure quality content.
- **User Management**: Approve instructor account registrations.
- **Dashboard**: Full overview of all projects and users in the system.

---

## 📝 Common Workflows

### Uploading a Project (Student)
1. Navigate to **Dashboard** -> **Upload Project**.
2. Fill in the **Project Name**, **Subject**, and **Technologies**.
3. Provide a **YouTube Link** (demonstration video).
4. Select an **Instructor** from the list to review your work.
5. Submit. Note: Your project will be `Pending` until an Admin approves it.

### Reviewing a Project (Admin)
1. Go to the **Admin Dashboard**.
2. Under "Pending Projects", click on a project to view details.
3. Review the content. Click **Approve** to make it public, or **Reject** with remarks.

### Providing Feedback (Instructor)
1. Go to the **Instructor Dashboard**.
2. You will see a list of projects assigned to you (only those approved by Admins).
3. Click **Add Feedback**, write your review, and save.
