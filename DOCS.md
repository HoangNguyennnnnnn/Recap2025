# � Master Guide: Deploy & Cấu Hình "A Secret in Time" - Recap 2025

Chào cậu! Để đưa ứng dụng lên online một cách chuyên nghiệp và ổn định nhất, hãy làm theo hướng dẫn "cầm tay chỉ việc" này nhé. 🌸✨

---

## 🏗️ Kiến Trúc Hệ Thống
Chúng ta sẽ chia dự án thành 3 phần chính trên mây:
1. **GitHub**: Nơi lưu trữ code (Bộ não).
2. **Render**: Chạy Backend (Trái tim - xử lý dữ liệu).
3. **Vercel**: Chạy Frontend (Giao diện - nơi cậu nhìn thấy).
4. **Cloudinary & MongoDB**: Lưu trữ ảnh/video và dữ liệu (Trí nhớ).

---

## 📦 Bước 0: Chuẩn Bị Code Trên GitHub
1. **Tạo Repo**: Lên [GitHub](https://github.com), tạo một Repository mới (Nên chọn **Private** để bảo mật).
2. **Push Code**: Đẩy toàn bộ thư mục `Recap2025` lên GitHub.
   - Lưu ý: Đảm bảo `.gitignore` đã có `.env` để không lộ mật khẩu.

---

## � Bước 1: Thiết Lập "Trí Nhớ" (Database & Media)

### 1.1 MongoDB Atlas (Dữ liệu)
1. Đăng ký/Đăng nhập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Tạo Database**: Nhấn **Create**, chọn gói **Shared (FREE)**.
3. **Security (Quan trọng)**:
   - **Database Access**: Tạo User (vd: `admin`), mật khẩu là `recap2025` (hãy đặt mật khẩu khó hơn nếu muốn).
   - **Network Access**: Nhấn **Add IP Address** -> Chọn **Allow Access From Anywhere** (để Render có thể kết nối được).
4. **Lấy link**: Nhấn **Connect** -> **Drivers** -> Copy chuỗi `mongodb+srv://...`.
   - *Thay `<password>` bằng mật khẩu cậu vừa tạo.*

### 1.2 Cloudinary (Ảnh & Video)
1. Đăng ký [Cloudinary](https://cloudinary.com).
2. Tại trang **Dashboard**, Copy 3 thông số: `Cloud Name`, `API Key`, `API Secret`.
3. Đây là nơi lưu những bức ảnh bí mật của chúng mình.

---

## ⚙️ Bước 2: Deploy Backend (Render)

1. Vào [Render Dashboard](https://dashboard.render.com).
2. **New** -> **Web Service** -> Kết nối GitHub và chọn Repo dự án.
3. **Cấu hình chi tiết**:
   - **Name**: `recap-api` (hoặc tên cậu thích).
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables**: Nhấn vào tab **Env Vars** và thêm:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | *Cái link MongoDB ở Bước 1.1* |
   | `CLOUDINARY_CLOUD_NAME` | *Lấy từ Cloudinary* |
   | `CLOUDINARY_API_KEY` | *Lấy từ Cloudinary* |
   | `CLOUDINARY_API_SECRET` | *Lấy từ Cloudinary* |
   | `JWT_SECRET` | *Một chuỗi dài bí mật tùy ý cậu* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `AUTH_PASSCODE` | *Mật khẩu đăng nhập web (vd: 1234)* |
5. **Nhấn Deploy**. Chờ Render báo `Live` ✅. Copy URL của nó (vd: `https://recap-api.onrender.com`).

---

## 🎨 Bước 3: Deploy Frontend (Vercel)

1. Vào [Vercel](https://vercel.com).
2. **Add New** -> **Project** -> Import Repo từ GitHub.
3. **Cấu hình chi tiết**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. **Environment Variables**: Thêm 1 biến duy nhất:
   - `VITE_API_URL`: *Dán URL Backend của Render vừa copy ở Bước 2 vào.*
5. **Nhấn Deploy**. Chờ 1 phút là xong! Cậu sẽ có URL web (vd: `https://recap-2025.vercel.app`).

---

## 🔄 Bước 4: Kết Nối Cuối Cùng (CORS)

Đây là bước hay bị quên nhất khiến đăng nhập bị lỗi:
1. Quay lại **Render Dashboard** -> Web Service của cậu.
2. Vào phần **Environment Variables**.
3. Thêm biến: `ALLOWED_ORIGINS` = *URL của Vercel (vd: `https://recap-2025.vercel.app`)*.
4. Render sẽ tự động redeploy. Sau khi xong, web của cậu đã chính thức thông suốt!

---

## 🌱 Bước 5: Nạp Dữ Liệu (Seeding)

Để web không bị trống trơn lúc mới chạy:
1. Mở terminal trên máy tính của cậu (trong thư mục `server`).
2. Tạm thời sửa `.env` trên máy để `MONGODB_URI` trỏ tới database online.
3. Chạy lệnh: `npm run seed`.
4. Dữ liệu sẽ được đẩy lên đám mây. Giờ hãy vào web và tận hưởng nhé!

---

## 🆘 Troubleshooting (Nếu gặp lỗi)

- **Lỗi trắng trang**: Mở F12 kiểm tra Console, thường là do `VITE_API_URL` bị sai hoặc thiếu dấu `https://`.
- **Đăng nhập báo lỗi**: Do chưa config `ALLOWED_ORIGINS` ở Bước 4 hoặc `AUTH_PASSCODE` không khớp.
- **Ảnh không hiện**: Kiểm tra lại Cloudinary API Keys.
- **Render bị chậm**: Vì dùng gói Free, Render sẽ "ngủ" sau 15p không ai vào. Lần đầu vào lại sẽ mất ~30s để tỉnh dậy.

---
Chúc cậu và người ấy có những giây phút thật hạnh phúc bên "Vũ trụ nhỏ" này! ❤️🌸
