# Hướng dẫn Deploy lên Cloudflare Pages

## ⚠️ LƯU Ý QUAN TRỌNG

Nếu bạn đang gặp lỗi deployment, **BẮT BUỘC** phải xóa Deploy command trong Cloudflare Dashboard theo hướng dẫn bên dưới.

---

## Phương pháp 1: Sửa Deploy Command trong Dashboard (BẮT BUỘC)

### Nếu project đã tồn tại và đang lỗi:

**Bước 1: Vào Settings**
1. Mở Cloudflare Dashboard: https://dash.cloudflare.com
2. Click vào **Workers & Pages** (menu bên trái)
3. Tìm và click vào project **tiem-chung**
4. Click tab **Settings**
5. Scroll xuống phần **Builds & deployments**

**Bước 2: Edit Configuration**
1. Trong mục **Build configuration**, click nút **Edit configuration**
2. Bạn sẽ thấy form với các trường:
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: (empty)
   Deploy command: npx wrangler deploy    ← XÓA CÁI NÀY
   ```

**Bước 3: XÓA Deploy Command**
1. Tìm trường **Deploy command**
2. **XÓA HOÀN TOÀN** nội dung trong trường này (để trống 100%)
3. Đảm bảo các trường khác như sau:
   ```
   Framework preset: None (hoặc để mặc định)
   Build command: npm run build
   Build output directory: dist
   Root directory: (để trống)
   Deploy command: (PHẢI TRỐNG - KHÔNG ĐIỀN GÌ)
   ```
4. Click nút **Save** màu xanh

**Bước 4: Retry Deployment**
1. Click tab **Deployments**
2. Tìm deployment bị failed (có dấu X đỏ)
3. Click nút **...** (3 chấm) bên phải
4. Click **Retry deployment**
5. Chờ build và deploy hoàn thành

---

## Phương pháp 2: Tạo Project mới (Nếu chưa có)

### Bước 1: Kết nối Repository
1. Đăng nhập vào Cloudflare Dashboard: https://dash.cloudflare.com
2. Vào **Workers & Pages** → **Create application**
3. Tab **Pages** → Click **Connect to Git**
4. Chọn GitHub → Authorize Cloudflare Pages (nếu chưa)
5. Chọn repository **tiem-chung**
6. Click **Begin setup**

### Bước 2: Cấu hình Build Settings

**ĐIỀN CHÍNH XÁC NHƯ SAU:**

```
Project name: tiem-chung
Production branch: claude/vaccination-portal-webapp-011CUPjhHaCNrBAYnkfVgfr
```

**Build settings:**
```
Framework preset: None (để mặc định, không chọn gì)
Build command: npm run build
Build output directory: dist
Root directory: (để trống)
```

**⚠️ QUAN TRỌNG NHẤT - Deploy command:**
```
Deploy command: (PHẢI ĐỂ TRỐNG - XÓA HẾT - KHÔNG ĐIỀN GÌ)
```

**Environment variables:**
- Không cần thiết lập gì cả

### Bước 3: Deploy
1. Click nút **Save and Deploy** màu xanh
2. Chờ build hoàn thành (khoảng 2-3 phút)
3. Sau khi build thành công, app sẽ được deploy tự động!
4. Bạn sẽ nhận được URL dạng: `https://tiem-chung.pages.dev`

---

## Lỗi thường gặp và cách sửa

### ❌ Lỗi: "It looks like you've run a Workers-specific command in a Pages project"

**Log sẽ hiển thị:**
```
Executing user deploy command: npx wrangler deploy
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
```

**Nguyên nhân:**
Deploy command đang được set là `npx wrangler deploy` hoặc bất kỳ command nào khác.

**Giải pháp:**
1. Vào **Settings** → **Builds & deployments**
2. Click **Edit configuration**
3. **XÓA HOÀN TOÀN** nội dung trong trường "Deploy command"
4. Click **Save**
5. Quay lại tab **Deployments**
6. Click **Retry deployment**

### ❌ Lỗi: "Missing entry-point to Worker script or to assets directory"

**Nguyên nhân:**
Wrangler đang cố deploy như Workers thay vì Pages.

**Giải pháp:**
Xóa deploy command như hướng dẫn ở trên. File `wrangler.toml` đã được cấu hình đúng, nhưng vẫn cần xóa deploy command trong dashboard.

### ✅ Lỗi: SPA routing không hoạt động (404 khi refresh)

**Giải pháp:**
File `public/_redirects` đã được tạo sẵn để xử lý vấn đề này. Nếu vẫn lỗi, kiểm tra file này có trong `dist/` sau khi build.

---

## Giải thích: Tại sao phải xóa Deploy command?

Cloudflare Pages có 2 chế độ:
1. **Pages mode** (static sites): Tự động deploy sau khi build
2. **Workers mode** (serverless): Cần deploy command

Project này là **static site**, nên:
- ✅ Chỉ cần build command để tạo `dist/`
- ✅ Cloudflare tự động lấy `dist/` và deploy
- ❌ KHÔNG CẦN deploy command
- ❌ KHÔNG ĐƯỢC chạy `wrangler deploy`

Workflow đúng:
```
npm run build → tạo dist/ → Cloudflare tự động deploy dist/
```

Workflow sai (đang xảy ra):
```
npm run build → tạo dist/ → wrangler deploy (SAI!) → Lỗi
```

---

## Kiểm tra sau khi deploy thành công

1. **Truy cập URL:** `https://tiem-chung.pages.dev` (hoặc URL Cloudflare cung cấp)
2. **Test login:** Nhập số điện thoại và mật khẩu
3. **Test navigation:** Click xem thông tin cá nhân, lịch sử tiêm chủng
4. **Test SPA routing:**
   - Vào trang Personal Info
   - Nhấn F5 (refresh)
   - Trang không bị 404 → SPA routing hoạt động ✅

---

## Custom Domain (Tùy chọn)

1. Vào tab **Custom domains**
2. Click **Set up a custom domain**
3. Nhập domain của bạn (ví dụ: `tiemchung.example.com`)
4. Follow hướng dẫn để thêm CNAME record vào DNS

---

## Tự động deploy khi push code mới

Sau khi setup xong, Cloudflare Pages sẽ:
- ✅ Tự động build khi có code mới push lên branch `claude/vaccination-portal-webapp-011CUPjhHaCNrBAYnkfVgFfr`
- ✅ Tự động deploy nếu build thành công
- ✅ Giữ lại các deployment cũ để rollback nếu cần

---

## Cần trợ giúp?

Nếu vẫn gặp lỗi:
1. Kiểm tra lại Deploy command đã XÓA TRỐNG chưa (quan trọng nhất)
2. Kiểm tra Build command: `npm run build`
3. Kiểm tra Build output directory: `dist`
4. Xem logs chi tiết trong tab Deployments
5. Liên hệ support Cloudflare nếu vẫn lỗi

**Lưu ý:** 99% lỗi deployment đều do Deploy command chưa được xóa trong Settings.
