## 🚀 Multi-Tenant SaaS Platform

A robust, full-stack Multi-Tenant SaaS platform that empowers multiple organizations (tenants) to securely share a single application instance while keeping their data fully isolated.
Designed with real-world SaaS architecture principles, it supports role-based access control, project management, and centralized administration — all built with modern web technologies.

## 📌 Project Overview

This platform simulates how enterprise SaaS applications operate at scale, featuring:

Multi-tenant architecture ensuring strict data separation by tenant

Role-based authentication with flexible permissions (Super Admin, Admin, User)

Containerized deployment for easy setup and scalability

Ideal for learning, demos, and academic projects.

## ✨ Key Features

🏢 Multi-Tenancy: Data isolation per organization using tenant IDs

👤 Role-Based Access Control:

Super Admin: Oversees all tenants and system-wide settings

Admin: Manages projects and users within their tenant

User: Works on tasks assigned within projects

🔐 Secure Authentication: JWT-based login with encrypted passwords

📊 Interactive Dashboard: Tenant-specific and global insights

🗂️ Project & Task Management: Organized workspace per tenant

---
## 🧱 System Architecture (High-Level)
```bash
Client (React) 
     ↓
API Gateway (Express) 
     ↓
Business Logic & Access Control 
     ↓
Database (PostgreSQL)
```
## Clone the Repository
```

git clone <your-repo-url>
cd Multi-Tenant-SaaS-Platform
```
Configure Environment Create a .env file in the root directory (or ensure docker-compose.yml variables are correct):
```bash

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=saas_db
```
## ▶️ How to Run the Project

Prerequisites

Docker &
Docker Compose
## How to exicuting
```bash
docker-compose down
docker compose up --build
```
## 🌐 Access the Application
Service	URL
Frontend	
http://localhost:3000

Backend API	
http://localhost:5000/api/health

## Testing Credentials (Seed Data)
Super Admin:

```
Email: superadmin@system.com
Password: Admin@123
Subdomain: demo
```
Tenant Admin (Demo Company):
```
Email: admin@demo.com
Password: Demo@123
Subdomain: demo
```
Regural user1 
```
Email:user1@demo.com
password:User@123
Subdomain: demo
```
Regural user2 
```
Email:user2@demo.com
password:User@123
Subdomain: demo
```

### 🧪 How to Test

Login with Super Admin credentials to manage tenants and system overview

Login as a tenant user to create and manage projects

Verify role-based access control enforcement

Explore dashboard insights and data isolation

## 🛠️ Technology Stack
##Frontend

React.js

React Router

Context API

Custom CSS Styling
---

## Backend

Node.js & Express.js

Prisma ORM

PostgreSQL Database
---

## DevOps & Tools

Docker & Docker Compose

JWT Authentication

bcrypt for password hashing
##📂 Folder Structure
```
Multi-Tenant-SaaS-Platform/
│
├── frontend/
│   └── src/
│
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   └── seeds/
│
├── docker-compose.yml
└── README.md
```
---
## 🎯 Learning Outcomes

Master multi-tenant SaaS architecture principles

Implement secure JWT-based authentication & authorization

Deploy full-stack applications using Docker

Utilize Prisma ORM for database management

Build scalable, production-ready SaaS platforms


## 📌 Future Enhancements

Comprehensive Task Management Module

Subscription & Billing Integration

Automated Email Notifications

Detailed Activity Audit Logs

CI/CD Pipeline for Continuous Deployment










