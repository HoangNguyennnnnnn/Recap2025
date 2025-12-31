# Deployment Guide - Love Universe 2025

This guide walks you through deploying the Love Universe 2025 application to production using **Vercel** (frontend) and **Render** (backend).

## Overview

- **Frontend**: Deployed to Vercel (React + Vite)
- **Backend**: Deployed to Render (Node.js + Express)
- **Database**: MongoDB Atlas (already configured in Task 1.2)
- **Media Storage**: Cloudinary (already configured in Task 1.3)

---

## Prerequisites

Before deploying, ensure you have:

✅ GitHub repository with your code pushed
✅ MongoDB Atlas cluster set up with connection string
✅ Cloudinary account with API credentials
✅ Vercel account (free tier available)
✅ Render account (free tier available)

---

## Part 1: Backend Deployment (Render)

### Step 1: Create Render Account

1. Visit [render.com](https://render.com)
2. Sign up using GitHub (recommended for easier integration)
3. Verify your email address

### Step 2: Create Web Service

1. **From Dashboard**: Click "New +" → Select "Web Service"
2. **Connect Repository**:
   - Click "Connect GitHub" or "Connect GitLab"
   - Authorize Render to access your repositories
   - Select your `Recap2025` repository
3. **Configure Service**:
   - **Name**: `love-universe-2025-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Oregon, Frankfurt)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave blank (handled by build command)
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     cd server && npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     cd server && npm start
     ```
   - **Plan**: Free (512 MB RAM, services spin down after inactivity)

### Step 3: Configure Environment Variables

Add all environment variables from `server/.env.example`:

1. Click "Environment" tab in your Render service
2. Click "Add Environment Variable" for each:

| Key | Value | Where to Get It |
|-----|-------|----------------|
| `NODE_ENV` | `production` | Static value |
| `PORT` | `3000` | Static value |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas → Database → Connect → Connection String |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | Cloudinary Dashboard → Account Details |
| `CLOUDINARY_API_KEY` | Your API key | Cloudinary Dashboard → Account Details |
| `CLOUDINARY_API_SECRET` | Your API secret | Cloudinary Dashboard → Account Details |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Your Vercel deployment URL (add after frontend deployment) |
| `JWT_SECRET` | Random string | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

**Important**: For `ALLOWED_ORIGINS`, you'll add your Vercel URL after deploying the frontend (Step 2).

### Step 4: Configure Health Check

1. Scroll to "Health Check Path" section
2. Enter: `/api/health`
3. This ensures Render monitors your service availability

### Step 5: Deploy Backend

1. Click "Create Web Service"
2. Render will automatically build and deploy your backend
3. Monitor the logs for any errors
4. Once deployed, you'll see: **Your service is live at https://your-backend.onrender.com**

### Step 6: Verify Backend Deployment

Test your deployed backend:

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Expected response:
# {"status":"OK","message":"Love Universe 2025 Server is running!"}
```

Check the Render logs for:
- ✅ MongoDB connected successfully
- ✅ Cloudinary initialized successfully
- 🚀 Server is running on port 3000

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up using GitHub (recommended)
3. Verify your email address

### Step 2: Import Project

1. **From Dashboard**: Click "Add New..." → "Project"
2. **Import Git Repository**:
   - Click "Import" next to your `Recap2025` repository
   - If not listed, click "Adjust GitHub App Permissions" to grant access
3. **Configure Project**:
   - **Project Name**: `love-universe-2025` (or your preferred name)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default, `vercel.json` handles this)
   - **Build Command**: Use default or `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install`

### Step 3: Configure Environment Variables

1. Expand "Environment Variables" section
2. Add the following variables:

| Key | Value | 
|-----|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com` |
| `VITE_APP_NAME` | `Love Universe 2025` |

**Replace** `https://your-backend.onrender.com` with your actual Render backend URL from Part 1.

**Important**: Environment variables are available in:
- **Production**: Deployed site
- **Preview**: PR/branch previews
- **Development**: Local development (use `.env` file locally)

### Step 4: Deploy Frontend

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete (usually 1-2 minutes)
4. Once done, you'll see: **Your project is live at https://your-app.vercel.app**

### Step 5: Update Backend CORS

Now that you have your Vercel URL, update your backend's `ALLOWED_ORIGINS`:

1. Go back to your Render dashboard
2. Navigate to your backend service → "Environment"
3. Update `ALLOWED_ORIGINS` variable:
   - Value: `https://your-app.vercel.app`
   - If you have multiple domains: `https://your-app.vercel.app,https://custom-domain.com`
4. Your service will automatically redeploy with the new CORS settings

### Step 6: Verify Frontend Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Open browser DevTools → Network tab
3. Verify API calls to your backend are successful (no CORS errors)
4. Test core features:
   - Page loads correctly
   - Custom Tailwind theme colors display
   - API health check works

---

## Part 3: Post-Deployment Configuration

### Custom Domain (Optional)

#### Vercel (Frontend)
1. Go to your project settings → "Domains"
2. Click "Add Domain"
3. Enter your custom domain (e.g., `loveuniverse.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

#### Render (Backend)
1. Go to your service settings → "Custom Domains"
2. Click "Add Custom Domain"
3. Enter your backend domain (e.g., `api.loveuniverse.com`)
4. Add the provided CNAME record to your DNS provider
5. Wait for verification

**Remember**: If you add a custom domain to the frontend, update `ALLOWED_ORIGINS` on Render!

### Auto-Deploy Configuration

Both platforms support auto-deploy from GitHub:

**Vercel**:
- Auto-deploys are enabled by default
- Every push to `main` triggers production deployment
- PRs create preview deployments

**Render**:
- Auto-deploy is configured in `render.yaml` (`autoDeploy: true`)
- Every push to `main` triggers rebuild and deployment
- Free tier services spin down after 15 minutes of inactivity (cold starts on next request)

### Monitoring and Logs

**Render**:
- View logs: Service → "Logs" tab
- Set up email notifications: Service → "Notifications"
- Monitor health: Service → "Events"

**Vercel**:
- View deployment logs: Project → "Deployments" → Click deployment
- Analytics: Project → "Analytics" (requires Pro plan)
- Real-time logs: Vercel CLI (`vercel logs`)

---

## Environment Variables Checklist

### Backend (Render)

| Variable | Required | Where to Find |
|----------|----------|---------------|
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ✅ | Set to `3000` |
| `MONGODB_URI` | ✅ | MongoDB Atlas Dashboard |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary Dashboard |
| `ALLOWED_ORIGINS` | ✅ | Your Vercel URL |
| `JWT_SECRET` | ✅ | Generate random string |

### Frontend (Vercel)

| Variable | Required | Where to Find |
|----------|----------|---------------|
| `VITE_API_URL` | ✅ | Your Render backend URL |
| `VITE_APP_NAME` | ⚠️ Optional | Static value |

---

## Troubleshooting

### Common Issues

#### Frontend can't connect to backend
- **Symptom**: CORS errors in browser console
- **Fix**: Verify `ALLOWED_ORIGINS` in Render matches your Vercel URL exactly
- **Fix**: Check `VITE_API_URL` in Vercel matches your Render URL

#### Backend shows "MONGODB_URI is not defined"
- **Symptom**: Deployment logs show MongoDB connection error
- **Fix**: Double-check `MONGODB_URI` is added in Render environment variables
- **Fix**: Ensure connection string format is correct

#### Render service keeps spinning down
- **Issue**: Free tier services sleep after 15 minutes of inactivity
- **Impact**: First request after sleep takes 30-60 seconds (cold start)
- **Solutions**: 
  - Upgrade to paid plan ($7/month for always-on)
  - Use external uptime monitor to ping every 10 minutes
  - Accept cold starts as part of free tier

#### Build fails on Vercel
- **Check**: Build logs in Vercel deployment details
- **Common causes**: 
  - Missing dependencies in `package.json`
  - TypeScript errors (strict mode enabled)
  - Environment variables not set
- **Fix**: Test build locally first: `cd client && npm run build`

#### Build fails on Render
- **Check**: Build logs in Render deployment
- **Common causes**:
  - Build command path issues
  - Missing dependencies
  - TypeScript compilation errors
- **Fix**: Test build locally first: `cd server && npm run build`

### Getting Help

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas Support**: https://www.mongodb.com/docs/atlas/
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## Verification Checklist

After deployment, verify:

### Backend (Render)
- [ ] Health endpoint responds: `curl https://your-backend.onrender.com/api/health`
- [ ] MongoDB connection successful (check Render logs)
- [ ] Cloudinary initialized (check Render logs)
- [ ] CORS properly configured (test from frontend)
- [ ] Media API endpoints work: `https://your-backend.onrender.com/api/media`

### Frontend (Vercel)
- [ ] Site loads at Vercel URL
- [ ] Custom Tailwind theme displays correctly
- [ ] Google Fonts load properly
- [ ] API calls to backend succeed (no CORS errors)
- [ ] All pages and routes work correctly

### Integration
- [ ] Frontend can communicate with backend
- [ ] Database reads/writes work from deployed backend
- [ ] Media uploads to Cloudinary work
- [ ] No console errors in browser DevTools

---

## Updating After Deployment

### Update Environment Variables

**Render**:
1. Go to service → "Environment"
2. Modify variable value
3. Service auto-redeploys

**Vercel**:
1. Go to project → "Settings" → "Environment Variables"
2. Edit variable
3. Redeploy for changes to take effect

### Update Code

Both platforms auto-deploy on git push:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## Production Best Practices

1. **Security**:
   - Never commit `.env` files to git
   - Use strong JWT secrets (64+ character random strings)
   - Keep Cloudinary and MongoDB credentials secure
   - Regularly rotate API keys

2. **Performance**:
   - Enable Vercel Edge Network (automatic)
   - Use Cloudinary transformations for image optimization
   - Monitor MongoDB Atlas performance metrics

3. **Monitoring**:
   - Set up email notifications for deployment failures
   - Monitor Render logs for errors
   - Use Vercel Analytics (if available)

4. **Backups**:
   - Enable MongoDB Atlas automated backups
   - Keep local copies of environment variables

---

## Cost Summary

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **MongoDB Atlas** | ✅ Yes | 512 MB storage |
| **Cloudinary** | ✅ Yes | 25 GB storage, 25 GB bandwidth/month |
| **Render** | ✅ Yes | 750 hours/month, services sleep after 15 min inactivity |
| **Vercel** | ✅ Yes | 100 GB bandwidth, unlimited deployments |

**Total Monthly Cost**: **$0** for hobby/learning projects!

---

## Next Steps

After successful deployment:
1. Share your live URL with users
2. Set up custom domains (optional)
3. Configure monitoring and alerts
4. Plan for scaling if needed
5. Implement CI/CD improvements (automated testing, preview deployments)

Congratulations! Your Love Universe 2025 app is now live! 🚀✨
