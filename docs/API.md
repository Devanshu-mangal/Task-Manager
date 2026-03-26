# Task Manager API

Base URL (local): `http://localhost:5000`  
All task routes require `Authorization: Bearer <JWT>` unless noted.

---

## Health

### `GET /api/health`

**Response** `200`

```json
{ "status": "ok" }
```

---

## Authentication

### `POST /api/auth/register`

**Request** body (JSON)

| Field       | Type   | Required | Notes                    |
|------------|--------|----------|--------------------------|
| email      | string | yes      | Valid email              |
| password   | string | yes      | Min 6 characters         |
| name       | string | no       | Display name             |

**Example**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret12",
  "name": "Demo User"
}
```

**Response** `201`

```json
{
  "token": "<jwt>",
  "user": { "id": "...", "email": "user@example.com", "name": "Demo User" }
}
```

**Errors** `400` validation, `409` email already registered

---

### `POST /api/auth/login`

**Request** body (JSON)

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | yes      |
| password | string | yes      |

**Example**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret12"
}
```

**Response** `200`

```json
{
  "token": "<jwt>",
  "user": { "id": "...", "email": "user@example.com", "name": "Demo User" }
}
```

**Errors** `401` invalid credentials

---

### `GET /api/auth/me`

**Headers** `Authorization: Bearer <token>`

**Response** `200`

```json
{
  "user": { "id": "...", "email": "user@example.com", "name": "Demo User" }
}
```

**Errors** `401` missing or invalid token

---

## Tasks (authenticated)

### `GET /api/tasks`

**Query parameters**

| Param   | Type   | Description                          |
|---------|--------|--------------------------------------|
| page    | number | Page default 1                       |
| limit   | number | Page size (max 50)                   |
| status  | string | `todo` \| `in-progress` \| `done`     |
| priority| string | `low` \| `medium` \| `high`          |
| search  | string | Title search (case-insensitive)      |
| sortBy  | string | `createdAt`, `dueDate`, `title`, …   |
| order   | string | `asc` \| `desc`                      |

**Response** `200`

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Task",
      "description": "",
      "status": "todo",
      "priority": "medium",
      "dueDate": null,
      "completed": false,
      "user": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 42,
    "totalPages": 5
  }
}
```

---

### `POST /api/tasks`

**Request** body (JSON)

| Field       | Type    | Required |
|-------------|---------|----------|
| title       | string  | yes      |
| description | string  | no       |
| status      | string  | no       |
| priority    | string  | no       |
| dueDate     | ISO8601 | no       |

**Response** `201` — created task object

---

### `GET /api/tasks/:id`

**Response** `200` — task object

**Errors** `404` not found

---

### `PATCH /api/tasks/:id`

**Request** body — partial fields (same as create)

**Response** `200` — updated task

---

### `DELETE /api/tasks/:id`

**Response** `204` no body

---

### `PATCH /api/tasks/:id/complete`

Sets status to `done` and `completed: true`.

**Response** `200` — updated task

---

## Analytics (authenticated)

### `GET /api/tasks/analytics`

**Response** `200`

```json
{
  "totalTasks": 10,
  "completedTasks": 3,
  "pendingTasks": 5,
  "completionPercentage": 30,
  "statusCounts": {
    "todo": 4,
    "in-progress": 3,
    "done": 3
  },
  "priorityCounts": {
    "low": 2,
    "medium": 5,
    "high": 3
  }
}
```

---

## Error format

```json
{ "message": "Human-readable message" }
```

Validation errors may include:

```json
{
  "message": "Validation failed",
  "errors": [{ "field": "email", "msg": "Invalid value" }]
}
```
