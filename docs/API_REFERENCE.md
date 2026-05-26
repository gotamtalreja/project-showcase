# API Reference

Base URL: `http://localhost:5000/api`

## Authentication (`/auth`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/signup` | POST | Public | Registers a new Student or Instructor. |
| `/login` | POST | Public | Authenticates user and returns JWT. |
| `/google` | POST | Public | Google OAuth authentication. |
| `/verify-email/:token` | GET | Public | Verifies account via email link. |
| `/instructors` | GET | Public | List of all instructors (for project assignment). |
| `/admin/pending-instructors` | GET | Admin | List of instructors awaiting approval. |
| `/admin/approve-instructor/:id`| PUT | Admin | Approves an instructor account. |

## Projects (`/projects`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | GET | Public | List all approved projects. |
| `/:id` | GET | Public | Details of a specific project. |
| `/` | POST | Student | Upload a new project. |
| `/student/my-projects` | GET | Student | List projects uploaded by current student. |
| `/instructor/assigned` | GET | Instructor| List projects assigned to current instructor. |
| `/:id/feedback` | PUT | Instructor| Add/update feedback for a project. |
| `/:id/like` | POST | Auth | Toggle like on a project. |
| `/admin/all` | GET | Admin | All projects regardless of status. |
| `/admin/pending` | GET | Admin | Projects awaiting moderator approval. |
| `/:id/review` | PUT | Admin | Approve or Reject a project. |

## Notifications (`/notifications`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | GET | Auth | List of notifications for current user. |
| `/unread-count` | GET | Auth | Count of unread notifications. |
| `/:id/read` | PUT | Auth | Mark a specific notification as read. |
| `/read-all` | PUT | Auth | Mark all notifications as read. |

## Common Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

## Error Codes
- `400`: Bad Request (Validation failed)
- `401`: Unauthorized (Missing or invalid token)
- `403`: Forbidden (Insufficient role permissions)
- `404`: Not Found
- `500`: Internal Server Error
