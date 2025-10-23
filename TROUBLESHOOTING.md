# 🔴 DEPLOYMENT ĐANG HIỂN THỊ SAI NỘI DUNG

## Vấn đề: Trang hiển thị "Hello World" thay vì app

Nếu bạn thấy "Hello World" hoặc trang trống, nghĩa là **Cloudflare đang deploy sai thư mục**.

---

## ✅ GIẢI PHÁP - Kiểm tra và sửa ngay:

### Bước 1: Kiểm tra Build Output Directory

1. Mở Cloudflare Dashboard: https://dash.cloudflare.com
2. Vào **Workers & Pages** → Click project **tiem-chung**
3. Click tab **Settings**
4. Scroll xuống **Builds & deployments**
5. Click **Edit configuration**

### Bước 2: Đảm bảo settings CHÍNH XÁC như sau:

```
Framework preset: None (hoặc để mặc định)
Build command: npm run build
Build output directory: dist           ← PHẢI LÀ "dist" KHÔNG CÓ "/"
Root directory: (để trống)             ← PHẢI TRỐNG
Deploy command: (để trống)             ← PHẢI TRỐNG
```

**⚠️ QUAN TRỌNG:**
- Build output directory: `dist` (KHÔNG phải `/dist` hoặc `./dist`)
- Root directory: PHẢI để trống
- Deploy command: PHẢI để trống

### Bước 3: Clear cache và redeploy

1. Click **Save** để lưu settings
2. Vào tab **Deployments**
3. Click **...** (3 chấm) trên deployment mới nhất
4. Click **Retry deployment**
5. Chờ build hoàn thành (~2-3 phút)

### Bước 4: Clear browser cache

Sau khi deployment mới thành công:
1. Mở trang trong incognito/private mode
2. Hoặc hard refresh: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)

---

## 🔍 Cách kiểm tra deployment đã đúng chưa:

### Trong Cloudflare Dashboard:

1. Vào tab **Deployments**
2. Click vào deployment mới nhất (có dấu check xanh)
3. Click **View build log**
4. Cuối log phải thấy:
   ```
   Success: Build command completed
   Deploying to Cloudflare Pages...
   Success: Deployed successfully
   ```
5. **KHÔNG được** thấy: `Executing user deploy command: npx wrangler deploy`

### Kiểm tra trên website:

1. Truy cập URL: `https://tiem-chung.pages.dev` (hoặc URL của bạn)
2. Bạn phải thấy màn hình **Login** với form nhập số điện thoại và mật khẩu
3. **KHÔNG phải** "Hello World" hoặc trang trống

---

## 🐛 Troubleshooting các trường hợp cụ thể:

### Trường hợp 1: Vẫn thấy "Hello World"

**Nguyên nhân:** Build output directory sai

**Giải pháp:**
- Đảm bảo Build output directory = `dist` (chữ thường, không có ký tự đặc biệt)
- Root directory = trống (không điền gì)
- Retry deployment

### Trường hợp 2: Trang trắng, không có gì

**Nguyên nhân:** JS/CSS files không load được

**Giải pháp:**
- Mở Developer Tools (F12)
- Vào tab Console
- Nếu thấy lỗi 404 cho file .js hoặc .css → Build output directory sai
- Sửa lại Build output directory = `dist`

### Trường hợp 3: Thấy code Vite default app

**Nguyên nhân:** Cloudflare đang deploy source code thay vì build output

**Giải pháp:**
- Kiểm tra Build command = `npm run build` (không phải `npm run dev`)
- Kiểm tra Build output directory = `dist`
- Xóa deploy command (để trống)

### Trường hợp 4: Deploy thành công nhưng vẫn thấy version cũ

**Giải pháp:**
1. Vào Cloudflare Dashboard → tab **Caching**
2. Click **Purge cache**
3. Clear browser cache: Ctrl+Shift+R
4. Mở incognito window

---

## 📋 Checklist - Đảm bảo tất cả đều ✅:

```
☐ Framework preset: None (hoặc mặc định)
☐ Build command: npm run build
☐ Build output directory: dist (chữ thường, không có /, không có .)
☐ Root directory: (trống)
☐ Deploy command: (trống)
☐ Đã Retry deployment sau khi sửa
☐ Đã clear browser cache
☐ Đã mở incognito để test
```

---

## 🎯 Kết quả mong đợi:

Khi truy cập `https://tiem-chung.pages.dev`, bạn sẽ thấy:

```
┌─────────────────────────────────────────┐
│                                         │
│         Sổ Tiêm Chủng                   │
│    Đăng nhập để xem thông tin           │
│                                         │
│  Số điện thoại: [____________]          │
│                                         │
│  Mật khẩu:      [____________]          │
│                                         │
│         [    Đăng nhập    ]             │
│                                         │
│   Hệ thống quản lý tiêm chủng VNCDC     │
│                                         │
└─────────────────────────────────────────┘
```

**KHÔNG phải**: "Hello World" hoặc trang trắng

---

## 🆘 Vẫn không được?

Nếu đã làm tất cả các bước trên mà vẫn lỗi:

1. **Screenshot settings** của bạn (Settings → Builds & deployments)
2. **Copy toàn bộ build log** (Deployments → Click vào deployment → View build log)
3. **Screenshot trang web** đang hiển thị gì
4. Liên hệ Cloudflare support với thông tin trên

---

## 💡 Giải thích kỹ thuật:

### Tại sao phải là "dist" không có "/" ?

```
✅ Đúng: dist
❌ Sai: /dist
❌ Sai: ./dist
❌ Sai: dist/
```

Cloudflare Pages expects relative path từ root của repo, không phải absolute path.

### Workflow đúng:

```
1. Cloudflare clone repo
2. Chạy: npm install
3. Chạy: npm run build → tạo folder dist/
4. Cloudflare lấy nội dung từ dist/ → deploy
5. Website live!
```

### Workflow sai (đang xảy ra):

```
1. Cloudflare clone repo
2. Chạy: npm install
3. Chạy: npm run build
4. Cloudflare lấy sai folder (root thay vì dist/) → deploy
5. Website hiển thị "Hello World" ❌
```
