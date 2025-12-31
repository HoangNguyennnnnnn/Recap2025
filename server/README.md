  # Love Universe 2025 - Backend Server

Backend server for the Love Universe 2025 PWA application, built with Express.js, TypeScript, and MongoDB Atlas.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **ODM**: Mongoose
- **Development**: tsx (TypeScript execution)

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster

1. **Sign up / Login**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account or log in
2. **Create New Cluster**:
   - Click "Build a Database"
   - Select **FREE** tier (M0 Sandbox - 512MB storage)
   - Choose cloud provider and region (select closest to your location for better performance)
   - Cluster name: `love-universe-2025` (or any name you prefer)

### 2. Configure Database Access

1. **Create Database User**:
   - Navigate to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication method
   - Set username and password (save these credentials securely!)
   - Grant "Read and write to any database" privileges
   - Click "Add User"

2. **Configure Network Access**:
   - Navigate to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - For production: Add your specific IP addresses
   - Click "Confirm"

### 3. Get Connection String

1. **Obtain Connection String**:
   - Navigate to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string (format: `mongodb+srv://<username>:<password>@...`)

2. **Example Format**:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/love-universe-2025?retryWrites=true&w=majority
   ```

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express, cors, dotenv
- mongoose (MongoDB ODM)
- TypeScript and development tools

### 2. Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** and update the `MONGODB_URI`:
   ```bash
   MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-url>/love-universe-2025?retryWrites=true&w=majority
   ```

   Replace:
   - `<your-username>` with your database username
   - `<your-password>` with your database password
   - `<your-cluster-url>` with your cluster URL (e.g., `cluster0.abc123.mongodb.net`)

### 3. Verify Database Connection

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Check console output** for successful connection:
   ```
   ✅ MongoDB connected successfully
   📊 Database: love-universe-2025
   🔗 Mongoose connected to MongoDB
   🚀 Server is running on port 3000
   ```

3. **Test the health endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected response:
   ```json
   {"status":"OK","message":"Love Universe 2025 Server is running!"}
   ```

## Database Models

The application includes the following Mongoose models:

### User Model
- Session-based authentication
- User preferences storage
- Last visit tracking

### Memory Model
- Photo memories with titles and descriptions
- Date-based organization
- Story narratives

### Comment Model
- Comments on memories
- Author tracking
- Timestamp management

### Reaction Model
- Reactions to memories, videos, and photos
- Support for multiple reaction types (like, love, heart)
- User attribution

### Letter Model
- Time-locked letters
- Unlock date management
- Read status tracking

### VoiceNote Model
- Location-based voice recordings
- Geographic coordinates
- Audio storage with optional transcripts

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection utility
│   ├── models/
│   │   ├── User.ts           # User model
│   │   ├── Memory.ts         # Memory model
│   │   ├── Comment.ts        # Comment model
│   │   ├── Reaction.ts       # Reaction model
│   │   ├── Letter.ts         # Letter model
│   │   ├── VoiceNote.ts      # VoiceNote model
│   │   └── index.ts          # Model exports
│   └── index.ts              # Server entry point
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## Available Scripts

- **`npm run dev`** - Start development server with auto-reload
- **`npm run build`** - Build TypeScript to JavaScript
- **`npm start`** - Run production server
- **`npm run lint`** - Run ESLint

## Database Features

### Connection Resilience
- Automatic retry mechanism (up to 5 attempts with 5-second delays)
- Connection pooling (min: 2, max: 10)
- Graceful shutdown on process termination

### Optimized Indexes
- **User**: `sessionToken` for fast authentication
- **Memory**: `date` for chronological queries
- **Comment**: `memoryId` for efficient retrieval
- **Reaction**: Compound index on `targetType` and `targetId`
- **Letter**: `unlockDate` and `isOpened` for time-based queries
- **VoiceNote**: `date` and geospatial coordinates

## Troubleshooting

### Connection Issues

1. **"MONGODB_URI is not defined"**:
   - Ensure `.env` file exists in the server root
   - Verify `MONGODB_URI` is set in `.env`

2. **Authentication failures**:
   - Double-check username and password in connection string
   - Ensure database user has proper permissions

3. **Network access denied**:
   - Verify IP address is whitelisted in MongoDB Atlas Network Access
   - For development, ensure `0.0.0.0/0` is added

4. **Connection timeout**:
   - Check internet connection
   - Verify cluster is active in MongoDB Atlas dashboard
   - Ensure firewall isn't blocking MongoDB ports

## Next Steps

- Add API routes for CRUD operations
- Implement authentication middleware
- Set up Cloudinary for media uploads
- Add input validation and sanitization
- Write unit and integration tests

## License

ISC
