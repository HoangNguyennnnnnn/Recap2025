# Love Universe 2025 - The Digital Memoryscape

A romantic Progressive Web App (PWA) designed to curate memories, time-gated letters, and geospatial voice notes in a beautiful, shared digital universe.

## ✨ Features

- **Memory Vault**: A rich media gallery for documenting milestones with photos, stories, and tags.
- **Echoes of Love (Voice Map)**: An interactive 3D Earth where voice messages are pinned to locations.
- **Secret Vault**: Time-capsule letters that remain locked until a specific future date.
- **Real-time Presence**: See when your partner is online ("Hna is here ❤️").
- **PWA Ready**: Installable on iOS and Android for a native app-like experience.
- **Visuals**: stunning "Deep Blue" & "Stardust Gold" aesthetic with smooth Framer Motion animations.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for media storage)

### 2. Installation

 Clone the repository:
   ```bash
   git clone https://github.com/HoangNguyennnnnnn/Recap2025.git
   cd Recap2025
   ```

 Install dependencies for both Client and Server:
   ```bash
   # Root/Client
   cd client
   npm install

   # Server
   cd ../server
   npm install
   ```

### 3. Configuration
Duplicate `.env.example` in both folders and fill in your credentials.

**Server (`server/.env`):**
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:3000
```

### 4. Seeding Data (Optional)
Populate the database with sample memories, letters, and voice notes:
```bash
cd server
npm run seed
```

### 5. Running the App
Start both servers in separate terminals:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to explore the universe!

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Framer Motion, Tailwind CSS, Mapbox/React-GL (or similar for 3D Earth).
- **Backend**: Node.js, Express, Socket.io (Real-time), MongoDB (Mongoose).
- **Mobile**: Vite PWA Plugin (Installable).
- **Media**: Cloudinary utilization.

## 📖 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to **Render** (Backend) and **Vercel** (Frontend).
