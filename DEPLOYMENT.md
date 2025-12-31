# Deployment Guide - Love Universe 2025

This guide walks you through deploying the Love Universe 2025 application to production.

## Architecture
- **Frontend**: Vercel (React + Vite PWA)
- **Backend**: Render (Node.js + Express + Socket.io)
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary

---

## 1. Backend Deployment (Render)

1.  **Create Service**:
    -   Connect your GitHub repo to Render.
    -   Select `server` as the Root Directory.
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm start`

2.  **Environment Variables**:
    -   `NODE_ENV`: `production`
    -   `MONGODB_URI`: Your Atlas connection string.
    -   `JWT_SECRET`: A secure random string.
    -   `ALLOWED_ORIGINS`: Your future Frontend URL (e.g., `https://love-universe.vercel.app`).
    -   `CLOUDINARY_...`: Your API credentials.

3.  **Seeding Data (Production)**:
    -   Once deployed, you can use the Shell/Console in Render to run `npm run seed` if you want to initialize the DB with starter content.

---

## 2. Frontend Deployment (Vercel)

1.  **Create Project**:
    -   Import the repo into Vercel.
    -   Select `client` as the Root Directory.
    -   **Framework**: Vite
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`

2.  **Environment Variables**:
    -   `VITE_API_URL`: The URL of your deployed Render backend (e.g., `https://love-universe-api.onrender.com`).

3.  **Cross-Origin Configuration**:
    -   After Vercel generates your domain, go back to Render and update `ALLOWED_ORIGINS` to match this domain (no trailing slash).

---

## 3. PWA Verification

-   Visit your Vercel URL on mobile.
-   Tap "Share" -> "Add to Home Screen" (iOS) or "Install App" (Android).
-   The app should launch in standalone mode (no browser bars) with the correct icon and splash screen.

## 4. Updates

-   **Auto-Deploy**: Both Vercel and Render will auto-deploy when you push changes to the `main` branch.
