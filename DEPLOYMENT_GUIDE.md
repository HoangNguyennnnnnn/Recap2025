# 🚀 Complete Deployment Guide - Love Universe 2025

Hướng dẫn chi tiết từng bước để deploy ứng dụng Love Universe lên production.

---

## 📋 Tổng Quan Kiến Trúc

| Service       | Platform      | Free Tier     |
| ------------- | ------------- | ------------- |
| Frontend      | Vercel        | ✅ Unlimited  |
| Backend       | Render        | ✅ 750h/month |
| Database      | MongoDB Atlas | ✅ 512MB      |
| Media Storage | Cloudinary    | ✅ 25GB       |

---

## 1️⃣ MongoDB Atlas (Database)

### Bước 1: Tạo tài khoản

1. Truy cập [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** → Đăng ký bằng Google hoặc Email

### Bước 2: Tạo Cluster

1. Chọn **M0 Sandbox (Free Forever)**
2. Chọn Cloud Provider: **AWS**
3. Region: **Singapore (ap-southeast-1)** hoặc gần nhất
4. Cluster Name: `love-universe-cluster`
5. Click **"Create Cluster"** (đợi 3-5 phút)

### Bước 3: Cấu hình Security

1. **Database Access** → Add New Database User:
   - Username: `love-admin`
   - Password: Tạo password mạnh (SAVE LẠI!)
   - Role: `Read and write to any database`
2. **Network Access** → Add IP Address:
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Hoặc thêm IP của Render sau

### Bước 4: Lấy Connection String

1. Click **"Connect"** → **"Connect your application"**
2. Driver: **Node.js**, Version: **5.5 or later**
3. Copy connection string:

```
mongodb+srv://love-admin:<password>@love-universe-cluster.xxxxx.mongodb.net/love-universe?retryWrites=true&w=majority
```

4. **QUAN TRỌNG**: Thay `<password>` bằng password thật

---

## 2️⃣ Cloudinary (Media Storage)

### Bước 1: Tạo tài khoản

1. Truy cập [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Đăng ký bằng Google hoặc Email

### Bước 2: Lấy API Credentials

1. Sau khi đăng nhập, vào **Dashboard**
2. Tìm mục **"Product Environment Credentials"**
3. Copy 3 giá trị:
   - **Cloud Name**: `dxxxxxx`
   - **API Key**: `123456789012345`
   - **API Secret**: `aBcDeFgHiJkLmNoPqRsTuVwXyZ`

### Bước 3: Tạo Folders (Optional)

1. Vào **Media Library** → **Create Folder**
2. Tạo 2 folders:
   - `love-universe/photos`
   - `love-universe/videos`

---

## 3️⃣ Deploy Backend lên Render

### Bước 1: Tạo tài khoản Render

1. Truy cập [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Đăng nhập bằng GitHub (recommended)

### Bước 2: Connect Repository

1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository: `Recap2025`
3. Authorize Render to access repo

### Bước 3: Configure Service

```
Name: love-universe-api
Region: Singapore (Southeast Asia)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free
```

### Bước 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

| Key                     | Value                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `NODE_ENV`              | `production`                                                                         |
| `PORT`                  | `3000`                                                                               |
| `MONGODB_URI`           | `mongodb+srv://love-admin:xxx@...` (từ bước 1)                                       |
| `CLOUDINARY_CLOUD_NAME` | `dxxxxxx`                                                                            |
| `CLOUDINARY_API_KEY`    | `123456789012345`                                                                    |
| `CLOUDINARY_API_SECRET` | `aBcDeFgHiJkLmNoPqRsTuVwXyZ`                                                         |
| `JWT_SECRET`            | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN`        | `7d`                                                                                 |
| `AUTH_PASSCODE`         | `14022020` (ngày đặc biệt của bạn)                                                   |
| `ALLOWED_ORIGINS`       | `https://your-app.vercel.app` (cập nhật sau)                                         |

### Bước 5: Deploy

1. Click **"Create Web Service"**
2. Đợi build hoàn tất (5-10 phút)
3. Copy URL: `https://love-universe-api.onrender.com`

---

## 4️⃣ Deploy Frontend lên Vercel

### Bước 1: Tạo tài khoản Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → Đăng nhập bằng GitHub

### Bước 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import repository: `Recap2025`
3. Configure:

```
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Bước 3: Environment Variables

Add variable:

| Key            | Value                                                    |
| -------------- | -------------------------------------------------------- |
| `VITE_API_URL` | `https://love-universe-api.onrender.com` (URL từ Render) |

### Bước 4: Deploy

1. Click **"Deploy"**
2. Đợi build hoàn tất (2-3 phút)
3. Copy URL: `https://love-universe-xxx.vercel.app`

---

## 5️⃣ Cập Nhật CORS (Quan Trọng!)

Sau khi có Vercel URL, quay lại Render:

1. Vào **Dashboard** → **love-universe-api** → **Environment**
2. Update `ALLOWED_ORIGINS`:

```
https://love-universe-xxx.vercel.app
```

3. Click **"Save Changes"** → Service sẽ tự động redeploy

---

## 6️⃣ Seed Data (Optional)

Để thêm dữ liệu mẫu vào database:

### Option A: Qua Render Shell

1. Vào Render Dashboard → Service → **Shell**
2. Chạy:

```bash
npm run seed
```

### Option B: Qua Local

1. Tạo file `server/.env` với credentials production
2. Chạy:

```bash
cd server
npm run seed
```

---

## 7️⃣ Custom Domain (Optional)

### Vercel (Frontend)

1. Vào Project Settings → **Domains**
2. Add domain: `love.yourdomain.com`
3. Cấu hình DNS theo hướng dẫn

### Render (Backend)

1. Vào Service Settings → **Custom Domains**
2. Add domain: `api.yourdomain.com`
3. Cấu hình DNS CNAME

---

## 🔧 Troubleshooting

### Lỗi: "Failed to fetch" / CORS Error

- Kiểm tra `ALLOWED_ORIGINS` có đúng URL frontend không
- Không có trailing slash `/` ở cuối URL
- Đợi Render redeploy sau khi đổi env

### Lỗi: "MongoDB connection failed"

- Kiểm tra password trong connection string
- Đảm bảo IP `0.0.0.0/0` được allow trong Network Access
- Check MongoDB Atlas cluster đang online

### Lỗi: "Cloudinary upload failed"

- Verify API Key và Secret đúng
- Check Cloud Name không có space

### App chậm / Cold Start

- Render Free tier sleep sau 15 phút không hoạt động
- First request sau khi sleep mất 30-60 giây
- Upgrade lên paid tier để tắt cold start

---

## 📱 PWA Installation

### iOS (Safari)

1. Mở app URL trên Safari
2. Tap **Share** (icon mũi tên)
3. Chọn **"Add to Home Screen"**
4. Đặt tên và tap **"Add"**

### Android (Chrome)

1. Mở app URL trên Chrome
2. Tap menu **⋮** → **"Install app"**
3. Hoặc tap banner "Add to Home Screen"

---

## 🔐 Security Checklist

- [ ] JWT_SECRET là random string dài (64+ characters)
- [ ] AUTH_PASSCODE không phải ngày quá dễ đoán
- [ ] ALLOWED_ORIGINS chỉ chứa domain chính thức
- [ ] MongoDB user có password mạnh
- [ ] Cloudinary API Secret không bị leak

---

## 📊 Monitoring

### Render

- Dashboard hiển thị logs realtime
- Metrics: CPU, Memory, Request count

### Vercel

- Analytics tab cho traffic
- Functions tab cho serverless logs

### MongoDB Atlas

- Metrics tab cho database performance
- Alert có thể setup cho disk space

---

## 🎉 Done!

Sau khi hoàn tất, ứng dụng sẽ có tại:

- **Frontend**: `https://love-universe-xxx.vercel.app`
- **Backend API**: `https://love-universe-api.onrender.com`

Chúc mừng! Ứng dụng Love Universe của bạn đã online! 💕
