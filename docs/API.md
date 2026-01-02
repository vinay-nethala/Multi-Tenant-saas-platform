# 📘 API Documentation

## Multi-Tenant SaaS Platform

This document describes all REST APIs used in the **Multi-Tenant SaaS Platform**, including authentication, tenant management, user management, and task management.

---

## 🔐 Authentication

### Login

**POST** `/api/auth/login`

Authenticate a user and return a JWT token.

**Request Body**

```json
{
  "email": "user1@demo.com",
  "password": "User@123",
  "tenantSubdomain": "demo"
}
```

**Response (200)**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "role": "USER"
  }
}
```

---

### Register Tenant

**POST** `/api/auth/register`

Create a new tenant and admin user.

**Request Body**

```json
{
  "companyName": "Demo Company",
  "adminEmail": "admin@demo.com",
  "password": "Demo@123"
}
```

---

## 🏢 Tenant Management (Super Admin)

### Get All Tenants

**GET** `/api/tenants`

**Headers**

```
Authorization: Bearer <token>
```

---

## 👤 User Management

### Create User

**POST** `/api/users`

Create a user under a tenant.

**Request Body**

```json
{
  "email": "user2@demo.com",
  "password": "User@123",
  "role": "USER"
}
```

---

### Get Users

**GET** `/api/users`

Returns all users of the logged-in tenant.

---

## ✅ Task Management

### Create Task

**POST** `/api/tasks`

**Request Body**

```json
{
  "title": "Finish UI",
  "description": "Complete dashboard UI"
}
```

---

### Get All Tasks

**GET** `/api/tasks`

Returns all tasks for the logged-in tenant.

---

### Update Task

**PUT** `/api/tasks/:id`

---

### Delete Task

**DELETE** `/api/tasks/:id`

---

## 🔑 Authentication Rules

* JWT token required for protected APIs
* Role-based access control enforced
* Users can access only their tenant data

---

## 📌 HTTP Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 500  | Server Error |

---

## 🧪 Testing

* APIs tested using Postman
* Docker-based environment
* Token-based authentication

---

## 🔐 Sample Credentials

* **Super Admin**: [superadmin@system.com](mailto:superadmin@system.com) / Admin@123
* **Tenant User**: [user1@demo.com](mailto:user1@demo.com) / User@123

---

## 🚀 Deployment

* Docker
* Docker Compose
* PostgreSQL

---
