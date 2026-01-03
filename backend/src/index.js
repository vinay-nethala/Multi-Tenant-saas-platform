const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { errorHandler } = require('./middleware/errorMiddleware');

// === IMPORT ROUTES ===
const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const { tenantUserRouter, userDirectRouter } = require('./routes/users');
const projectRoutes = require('./routes/projects');
const { projectTaskRouter, directTaskRouter } = require('./routes/tasks');

const prisma = new PrismaClient();
const app = express();

// === GLOBAL MIDDLEWARE ===
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// === BASE ROUTES (IMPORTANT FOR BROWSER & INSTRUCTOR) ===
app.get('/', (req, res) => {
  res.send('🚀 Multi-Tenant SaaS Backend is running');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Multi-Tenant SaaS API',
    status: 'OK',
    health: '/api/health'
  });
});

// === HEALTH CHECK ===
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      status: 'UP',
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'DOWN',
      database: 'Disconnected'
    });
  }
});

// === ROUTES MOUNTING ===

// 1. Auth APIs
app.use('/api/auth', authRoutes);

// 2. Tenant APIs
app.use('/api/tenants', tenantRoutes);

// 3. User APIs
app.use('/api/tenants/:tenantId/users', tenantUserRouter);
app.use('/api/users', userDirectRouter);

// 4. Project APIs
app.use('/api/projects', projectRoutes);

// 5. Task APIs
app.use('/api/projects/:projectId/tasks', projectTaskRouter);
app.use('/api/tasks', directTaskRouter);

// === ERROR HANDLER (LAST) ===
app.use(errorHandler);

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
