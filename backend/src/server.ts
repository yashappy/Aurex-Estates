import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import { authRouter } from './routes/auth';
import { projectsRouter } from './routes/projects';
import { leadsRouter } from './routes/leads';
import { blogsRouter } from './routes/blogs';
import { uploadRouter } from './routes/upload';

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'https://aurexestates.co.in',
  'https://www.aurexestates.co.in',
  'https://admin.aurexestates.co.in',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.aurexestates.co.in') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/production with explicit headers
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Aurex Estates Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/upload', uploadRouter);

// Root fallback info
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Aurex Estates Core API Service',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'active',
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Backend Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Aurex Backend] Server running on port ${PORT}`);
    console.log(`[Aurex Backend] Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
