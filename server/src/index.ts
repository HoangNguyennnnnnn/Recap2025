import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDatabase, setupDatabaseEventHandlers } from './config/database.js';
import { initializeCloudinary } from './config/cloudinary.js';
import mediaRouter from './routes/media.js';
import authRouter from './routes/auth.js';
import memoryRouter from './routes/memories.js';
import lettersRouter from './routes/letters.js';

import { initializeSocket } from './socket/index.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

// Always allow localhost in development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup Socket.io Logic
initializeSocket(io);

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Love Universe 2025 Server is running!' });
});

// Authentication routes
app.use('/api/auth', authRouter);

// Media API routes
app.use('/api/media', mediaRouter);

// Memory Vault routes
app.use('/api/memories', memoryRouter);

// Secret Vault (Letters) routes
app.use('/api/letters', lettersRouter);


// Database initialization and server startup
const startServer = async () => {
  // Start server FIRST so Render detects an open port immediately
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  try {
    // Setup database event handlers
    setupDatabaseEventHandlers();

    // Connect to MongoDB (this takes time and might retry)
    console.log('📡 Attempting to connect to MongoDB...');
    await connectDatabase();

    // Initialize Cloudinary (non-blocking if credentials not set)
    initializeCloudinary();

    console.log(`🔌 Socket.io ready for connections`);
    console.log(`📡 Media API ready`);
  } catch (error) {
    console.error('💥 Database connection failed, but server is still listening:', error);
    // We don't exit(1) here because we want to allow retries or manual intervention
  }
};

// Start the server
startServer();

export default app;
