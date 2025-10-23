# Hướng dẫn Deploy lên Cloudflare Pages

## Cấu hình trong Cloudflare Pages Dashboard

### Bước 1: Kết nối Repository
1. Đăng nhập vào Cloudflare Dashboard
2. Vào **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Chọn repository `tiem-chung`
4. Click **Begin setup**

### Bước 2: Cấu hình Build Settings

**QUAN TRỌNG: Thiết lập chính xác như sau:**

```
Project name: tiem-chung (hoặc tên bạn muốn)
Production branch: claude/vaccination-portal-webapp-011CUPjhHaCNrBAYnkfVgFfr
```

**Build settings:**
```
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: (để trống)
```

**QUAN TRỌNG - Deploy command:**
```
Deploy command: (XÓA TRỐNG - không điền gì cả)
```

**Environment variables:** Không cần thiết lập

### Bước 3: Deploy
1. Click **Save and Deploy**
2. Chờ build hoàn thành (khoảng 2-3 phút)
3. App sẽ được deploy tự động!

## Lỗi thường gặp

### Lỗi: "It looks like you've run a Workers-specific command in a Pages project"

**Nguyên nhân:** Deploy command đang set là `npx wrangler deploy` hoặc tương tự

**Giải pháp:**
1. Vào **Settings** → **Builds & deployments**
2. Trong phần **Build configurations**, click **Edit**
3. **XÓA TRỐNG** phần "Deploy command" (không điền gì)
4. Click **Save**
5. Trigger lại deployment bằng cách click **Retry deployment**

### Lỗi: SPA routing không hoạt động

**Giải pháp:** File `public/_redirects` đã được tạo sẵn để xử lý vấn đề này.

## Kiểm tra sau khi deploy

1. Truy cập URL được Cloudflare cung cấp (dạng `https://tiem-chung.pages.dev`)
2. Test đăng nhập
3. Test chuyển trang (SPA routing)
4. Refresh trang ở các route khác nhau để đảm bảo `_redirects` hoạt động

## Custom Domain (Tùy chọn)

1. Vào **Custom domains**
2. Click **Set up a custom domain**
3. Nhập domain của bạn
4. Follow hướng dẫn để cấu hình DNS

## Tự động deploy khi push code mới

Cloudflare Pages sẽ tự động build và deploy khi bạn push code mới lên branch `claude/vaccination-portal-webapp-011CUPjhHaCNrBAYnkfVgFfr`.
