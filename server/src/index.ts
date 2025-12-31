import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, setupDatabaseEventHandlers } from './config/database.js';
import { initializeCloudinary } from './config/cloudinary.js';
import mediaRouter from './routes/media.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

// Always allow localhost in development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Love Universe 2025 Server is running!' });
});

// Media API routes
app.use('/api/media', mediaRouter);

// Database initialization and server startup
const startServer = async () => {
  try {
    // Setup database event handlers
    setupDatabaseEventHandlers();

    // Connect to MongoDB
    await connectDatabase();

    // Initialize Cloudinary (non-blocking if credentials not set)
    initializeCloudinary();

    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Media API: http://localhost:${PORT}/api/media`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
