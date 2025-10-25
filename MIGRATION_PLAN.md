# KỊCH BẢN MIGRATION CHI TIẾT: VITE → NEXT.JS 15

> **Dự án:** Sổ Tiêm Chủng Điện Tử - VNCDC
> **Ngày:** 25/10/2025
> **Version hiện tại:** React 19.1.1 + Vite 7.1.7
> **Version đích:** Next.js 15.4 + React 19 + Tailwind CSS v3 + shadcn/ui
> **Chiến lược:** Hybrid Incremental Migration (8 phases)
> **Timeline:** 7-8 tuần
> **Estimated effort:** 188 hours

---

## 📋 MỤC LỤC

1. [Pre-Migration Checklist](#1-pre-migration-checklist)
2. [Phase 1: Setup & Foundation (Week 1)](#phase-1-setup--foundation-week-1)
3. [Phase 2: Migrate UI Components (Week 2)](#phase-2-migrate-ui-components-week-2)
4. [Phase 3: Migrate API Service (Week 2)](#phase-3-migrate-api-service-week-2)
5. [Phase 4: Migrate Pages (Week 3-4)](#phase-4-migrate-pages-week-3-4)
6. [Phase 5: Implement Authentication Middleware (Week 5)](#phase-5-implement-authentication-middleware-week-5)
7. [Phase 6: PWA & Analytics (Week 6)](#phase-6-pwa--analytics-week-6)
8. [Phase 7: Optimization & Testing (Week 7)](#phase-7-optimization--testing-week-7)
9. [Phase 8: Deployment (Week 8)](#phase-8-deployment-week-8)
10. [Post-Migration Tasks](#10-post-migration-tasks)
11. [Rollback Plan](#11-rollback-plan)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. PRE-MIGRATION CHECKLIST

### ✅ Prerequisites

**Trước khi bắt đầu migration, đảm bảo:**

- [ ] **Backup codebase:**
  ```bash
  git tag v1.0.0-vite-backup
  git push origin v1.0.0-vite-backup
  ```

- [ ] **Document current system:**
  - [ ] API endpoints documented
  - [ ] Authentication flow documented
  - [ ] Environment variables documented
  - [ ] Deployment process documented

- [ ] **Setup environments:**
  - [ ] Development environment ready
  - [ ] Staging environment ready (optional but recommended)
  - [ ] Production environment plan

- [ ] **Team readiness:**
  - [ ] Team có Next.js experience (hoặc đã training)
  - [ ] Code review process setup
  - [ ] Testing strategy agreed

- [ ] **Tools installed:**
  ```bash
  node --version  # Should be >= 18.17
  npm --version   # Should be >= 9.x
  git --version   # Latest
  ```

- [ ] **Create migration branch:**
  ```bash
  git checkout -b migrate/nextjs-15
  ```

### 📊 Pre-Migration Metrics (Baseline)

**Đo lường performance hiện tại để so sánh:**

```bash
# Run Lighthouse audit
npm run build
npm run preview
# Open http://localhost:4173 và chạy Lighthouse

# Record baseline metrics:
# - Performance score: ___
# - FCP: ___ms
# - LCP: ___ms
# - TTI: ___ms
# - Bundle size: ___KB
```

**Save to file:**
```bash
# pre-migration-metrics.json
{
  "lighthouse": {
    "performance": 85,
    "accessibility": 92,
    "bestPractices": 90,
    "seo": 88
  },
  "vitals": {
    "fcp": 200,
    "lcp": 400,
    "tti": 300
  },
  "bundle": {
    "total": 250,
    "vendor": 150,
    "app": 100
  }
}
```

---

## PHASE 1: SETUP & FOUNDATION (Week 1)

**Goal:** Tạo Next.js project skeleton với cấu trúc hoàn chỉnh

**Estimated effort:** 16 hours

### Step 1.1: Create Next.js Project

```bash
# Navigate to parent directory
cd /Users/leo/Documents

# Create new Next.js project
npx create-next-app@latest tiem-chung-nextjs \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

# Answer prompts:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? Yes
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias (@/*)? No

cd tiem-chung-nextjs
```

**Result:**
```
tiem-chung-nextjs/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

### Step 1.2: Install Core Dependencies

```bash
# Install UI dependencies (giữ nguyên từ Vite)
npm install lucide-react class-variance-authority clsx tailwind-merge

# Install Tailwind typography plugin
npm install -D @tailwindcss/typography

# Install HTTP client (keep Axios for now)
npm install axios

# Install additional utilities
npm install date-fns  # For date formatting (optional but recommended)
```

**Updated package.json should include:**
```json
{
  "dependencies": {
    "react": "^19.x.x",
    "react-dom": "^19.x.x",
    "next": "^15.4.x",
    "axios": "^1.12.2",
    "lucide-react": "^0.546.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "date-fns": "^latest"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.19",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.9.3",
    "tailwindcss": "^3.4.18",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^9",
    "eslint-config-next": "^15.4.x"
  }
}
```

### Step 1.3: Setup shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Answer prompts:
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Would you like to use CSS variables for colors? › yes

# Install components used in project
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add alert
npx shadcn@latest add badge
npx shadcn@latest add skeleton
```

**Result:**
```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── dialog.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       └── skeleton.tsx
└── lib/
    └── utils.ts
```

### Step 1.4: Copy Tailwind Configuration

**From Vite project:**
```bash
# Copy tailwind config từ old project
# /Users/leo/Documents/tiem-chung/tailwind.config.js
```

**Update `tailwind.config.ts` in Next.js:**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

**Copy CSS variables to `src/app/globals.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 262.1 83.3% 57.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 1.5: Copy TypeScript Types

```bash
# Create types directory
mkdir -p src/types

# Copy types from old project
cp /Users/leo/Documents/tiem-chung/src/types/index.ts src/types/index.ts
```

**Verify types file has all interfaces:**
- `LoginRequest`, `LoginResponse`
- `ThanhVien`, `ThanhVienDetail`, `NguoiChamSoc`
- `KhangNguyenRecord`, `VacxinRecord`, `PhacDoRecord`
- `RecoverPasswordRequest`, `ActivateOtpRequest`, `ChangePasswordRequest`

### Step 1.6: Create Project Structure

```bash
# Create directory structure
mkdir -p src/app/login
mkdir -p src/app/change-password
mkdir -p src/app/personal-info
mkdir -p src/app/vaccination-history/[memberId]
mkdir -p src/app/api  # For future API routes (optional)
mkdir -p src/lib
mkdir -p src/components/ui  # Already created by shadcn
mkdir -p public
```

**Final structure should look like:**
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── login/
│   │   └── page.tsx
│   ├── change-password/
│   │   └── page.tsx
│   ├── personal-info/
│   │   └── page.tsx
│   └── vaccination-history/
│       └── [memberId]/
│           └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── dialog.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       └── skeleton.tsx
├── lib/
│   ├── utils.ts
│   ├── api.ts      (will create in Phase 3)
│   └── analytics.ts (will create in Phase 6)
└── types/
    └── index.ts
```

### Step 1.7: Configure Next.js

**Update `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for better error handling
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-stc-v2.vncdc.gov.vn',
        pathname: '/**',
      },
    ],
  },

  // Environment variables validation (optional)
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-stc-v2.vncdc.gov.vn',
  },

  // Experimental features (Next.js 15)
  experimental: {
    typedRoutes: true,  // Type-safe routing
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,
};

module.exports = nextConfig;
```

### Step 1.8: Setup Environment Variables

**Create `.env.local`:**
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api-stc-v2.vncdc.gov.vn

# Analytics (will add in Phase 6)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# App Configuration
NEXT_PUBLIC_APP_NAME=Sổ Tiêm Chủng Điện Tử - VNCDC
NEXT_PUBLIC_APP_URL=https://sotiemchung.vncdc.gov.vn
```

**Create `.env.example` for documentation:**
```bash
cp .env.local .env.example
# Edit .env.example to remove actual values
```

**Update `.gitignore`:**
```bash
# Environment variables
.env*.local
.env.development.local
.env.production.local
```

### Step 1.9: Update Root Layout

**Edit `src/app/layout.tsx`:**
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Sổ Tiêm Chủng Điện Tử - VNCDC",
  description:
    "Hệ thống quản lý sổ tiêm chủng điện tử - Trung tâm Kiểm soát Bệnh tật Quốc gia",
  keywords: [
    "tiêm chủng",
    "vaccine",
    "VNCDC",
    "sổ tiêm chủng điện tử",
    "vaccination",
  ],
  authors: [{ name: "VNCDC" }],
  creator: "VNCDC",
  publisher: "VNCDC",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sotiemchung.vncdc.gov.vn"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Sổ Tiêm Chủng Điện Tử - VNCDC",
    description:
      "Hệ thống quản lý sổ tiêm chủng điện tử - Trung tâm Kiểm soát Bệnh tật Quốc gia",
    siteName: "Sổ Tiêm Chủng Điện Tử",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sổ Tiêm Chủng Điện Tử - VNCDC",
    description:
      "Hệ thống quản lý sổ tiêm chủng điện tử - Trung tâm Kiểm soát Bệnh tật Quốc gia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add when available
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Preconnect to API */}
        <link rel="preconnect" href="https://api-stc-v2.vncdc.gov.vn" />
        <link rel="dns-prefetch" href="https://api-stc-v2.vncdc.gov.vn" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Step 1.10: Create Root Page (Redirect to Login)

**Edit `src/app/page.tsx`:**
```typescript
import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect root to login page
  redirect("/login");
}
```

### Step 1.11: Verify Setup

```bash
# Run development server
npm run dev

# Should see:
# ▲ Next.js 15.4.x
# - Local:        http://localhost:3000
# - Ready in 500ms

# Open browser and verify:
# - http://localhost:3000 redirects to /login (404 for now - OK)
# - No console errors
# - Tailwind CSS is loaded
```

### Step 1.12: Commit Phase 1

```bash
git add .
git commit -m "chore: Phase 1 - Setup Next.js 15 foundation

- Initialize Next.js 15 project with TypeScript & Tailwind
- Setup shadcn/ui components
- Configure Tailwind with custom theme
- Copy TypeScript types
- Create project structure
- Configure next.config.js
- Setup environment variables
- Create root layout with metadata
- Add preconnect to API

Phase 1 complete (16 hours)
"
```

---

## PHASE 2: MIGRATE UI COMPONENTS (Week 2)

**Goal:** Port all shadcn/ui components từ Vite project

**Estimated effort:** 12 hours

### Step 2.1: Verify shadcn/ui Components

**shadcn/ui đã tự động tạo components trong Phase 1:**
- ✅ `src/components/ui/button.tsx`
- ✅ `src/components/ui/card.tsx`
- ✅ `src/components/ui/tabs.tsx`
- ✅ `src/components/ui/dialog.tsx`
- ✅ `src/components/ui/alert.tsx`
- ✅ `src/components/ui/badge.tsx`
- ✅ `src/components/ui/skeleton.tsx`

### Step 2.2: Compare with Vite Components

**Check differences between auto-generated vs Vite custom components:**

```bash
# Compare button.tsx
diff /Users/leo/Documents/tiem-chung/src/components/ui/button.tsx \
     src/components/ui/button.tsx

# Compare each component similarly
```

**Expected:** shadcn/ui components should be identical or better.

**If custom modifications exist in Vite components:**
- Merge custom variants/props into Next.js components
- Document changes

### Step 2.3: Add 'use client' Directive

**All UI components are interactive → need 'use client':**

```typescript
// src/components/ui/button.tsx
'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ... rest of component
```

**Repeat for all components:**
- `button.tsx` ✅ Add 'use client'
- `card.tsx` ⚠️ Check if interactive (probably not needed)
- `tabs.tsx` ✅ Add 'use client'
- `dialog.tsx` ✅ Add 'use client'
- `alert.tsx` ⚠️ Check if interactive
- `badge.tsx` ❌ Not interactive (no need)
- `skeleton.tsx` ❌ Not interactive (no need)

**Rule:** Add `'use client'` if component:
- Uses `useState`, `useEffect`, hooks
- Handles events (`onClick`, `onChange`, etc.)
- Uses browser APIs

### Step 2.4: Test UI Components

**Create test page: `src/app/ui-test/page.tsx`:**

```typescript
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function UITestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">UI Components Test</h1>

      {/* Test Button */}
      <Card>
        <CardHeader>
          <CardTitle>Button Component</CardTitle>
        </CardHeader>
        <CardContent className="space-x-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </CardContent>
      </Card>

      {/* Test Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
        </CardHeader>
        <CardContent>
          This is a card content
        </CardContent>
      </Card>

      {/* Test Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Tab 1 content</TabsContent>
            <TabsContent value="tab2">Tab 2 content</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Test Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
              </DialogHeader>
              <p>Dialog content</p>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Test Alert */}
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>

      {/* Test Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Component</CardTitle>
        </CardHeader>
        <CardContent className="space-x-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Test Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Test:**
```bash
npm run dev
# Open http://localhost:3000/ui-test
# Verify all components render correctly
# Test interactivity (buttons, tabs, dialog)
```

### Step 2.5: Commit Phase 2

```bash
git add .
git commit -m "feat: Phase 2 - Migrate UI components

- Verify shadcn/ui components
- Add 'use client' directive to interactive components
- Create UI test page
- Test all components (button, card, tabs, dialog, alert, badge, skeleton)

Phase 2 complete (12 hours)
"
```

---

## PHASE 3: MIGRATE API SERVICE (Week 2)

**Goal:** Port API integration layer

**Estimated effort:** 12 hours

### Step 3.1: Copy API Service

```bash
# Copy api.ts from Vite project
cp /Users/leo/Documents/tiem-chung/src/services/api.ts src/lib/api.ts
```

### Step 3.2: Update API Service for Next.js

**Edit `src/lib/api.ts`:**

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-stc-v2.vncdc.gov.vn';

// Types import
import type {
  LoginRequest,
  LoginResponse,
  ThanhVienResponse,
  ThanhVienDetail,
  KhangNguyenResponse,
  VacxinResponse,
  PhacDoResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  ActivateOtpRequest,
  ActivateOtpResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/types';

class ApiService {
  private axiosInstance: AxiosInstance;
  private static TOKEN_KEY = 'vncdc_auth_token';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor - add token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Redirect to login (client-side only)
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management (localStorage - client-side only)
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ApiService.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ApiService.TOKEN_KEY);
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ApiService.TOKEN_KEY);
    }
  }

  // Authentication APIs
  async login(phoneNumber: string, password: string): Promise<LoginResponse> {
    const requestData: LoginRequest = {
      phoneNumber,
      pass: password,
      osType: 'web',
      osVersion: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      deviceId: 'web-browser',
      notificationToken: '',
    };

    const response = await this.axiosInstance.post<LoginResponse>('/auth', requestData);

    // Flexible token extraction
    const token =
      response.data.token ||
      response.data.data?.token ||
      (response.data as any).access_token ||
      (response.data as any).accessToken;

    if (token) {
      this.setToken(token);
    }

    return response.data;
  }

  // ... Copy all other methods from Vite api.ts
  // (getThanhVien, getThanhVienDetail, getVaccinationHistory, etc.)

  // Password recovery APIs
  async recoverPasswordBySms(phoneNumber: string): Promise<RecoverPasswordResponse> {
    // ... implementation
  }

  async activateOtp(phoneNumber: string, otp: string): Promise<ActivateOtpResponse> {
    // ... implementation
  }

  async changePasswordByToken(phoneNumber: string, password: string): Promise<ChangePasswordResponse> {
    // ... implementation
  }

  // Member APIs
  async getThanhVien(): Promise<ThanhVienResponse> {
    // ... implementation
  }

  async getThanhVienDetail(memberId: number): Promise<ThanhVienDetail> {
    // ... implementation
  }

  // Vaccination APIs
  async getKhangNguyenHistory(doiTuongId: number): Promise<KhangNguyenResponse> {
    // ... implementation
  }

  async getVacxinHistory(doiTuongId: number): Promise<VacxinResponse> {
    // ... implementation
  }

  async getPhacDoTiemChung(doiTuongId: number): Promise<PhacDoResponse> {
    // ... implementation
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export { ApiService };
```

**Key changes:**
- ✅ Updated imports to use `@/types`
- ✅ Use `process.env.NEXT_PUBLIC_API_BASE_URL`
- ✅ Add `typeof window !== 'undefined'` checks for browser-only APIs
- ✅ Keep localStorage for now (will migrate to cookies in Phase 5)

### Step 3.3: Test API Service

**Create test page: `src/app/api-test/page.tsx`:**

```typescript
'use client'

import { useState } from 'react'
import { apiService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function APITestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    try {
      // Test with dummy credentials (should fail)
      await apiService.login('0123456789', 'testpassword')
      setResult('Login successful!')
    } catch (error: any) {
      setResult(`Login failed: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>API Service Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testLogin} disabled={loading}>
            {loading ? 'Testing...' : 'Test Login API'}
          </Button>

          {result && (
            <Alert>
              <AlertDescription>{result}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Test:**
```bash
npm run dev
# Open http://localhost:3000/api-test
# Click "Test Login API"
# Should see error (expected - dummy credentials)
# Verify API call is made (check Network tab)
```

### Step 3.4: Commit Phase 3

```bash
git add .
git commit -m "feat: Phase 3 - Migrate API service

- Copy api.ts from Vite project
- Update imports to use @/ alias
- Add window checks for browser-only APIs
- Use NEXT_PUBLIC_API_BASE_URL env var
- Create API test page
- Test API service connectivity

Phase 3 complete (12 hours)
"
```

---

## PHASE 4: MIGRATE PAGES (Week 3-4)

**Goal:** Port all page components

**Estimated effort:** 40 hours

### Step 4.1: Migrate Login Page (Day 1-2)

**Copy from Vite:**
```bash
cp /Users/leo/Documents/tiem-chung/src/pages/Login.tsx src/app/login/page.tsx
```

**Update `src/app/login/page.tsx`:**

```typescript
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'  // ← Changed
import { Eye, EyeOff, Loader2, Lock, Phone } from 'lucide-react'
import { apiService } from '@/lib/api'  // ← Changed
import { Button } from '@/components/ui/button'  // ← Changed
import { Alert, AlertDescription } from '@/components/ui/alert'  // ← Changed
// ... other imports updated to @/

export default function LoginPage() {
  const router = useRouter()  // ← Changed from useNavigate
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiService.login(phoneNumber, password)
      // Navigate to personal info page
      router.push('/personal-info')  // ← Changed from navigate()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setLoading(false)
    }
  }

  // ... rest of component (keep UI exactly same)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* ... exact same UI from Vite ... */}
    </div>
  )
}
```

**Key changes:**
- ✅ Add `'use client'` at top
- ✅ `import { useRouter } from 'next/navigation'` (not 'next/router')
- ✅ `const router = useRouter()` instead of `useNavigate()`
- ✅ `router.push('/personal-info')` instead of `navigate('/personal-info')`
- ✅ Update all imports to `@/` alias
- ✅ Keep all UI exactly same

**Add metadata (optional SEO improvement):**

Create `src/app/login/layout.tsx`:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập - Sổ Tiêm Chủng Điện Tử',
  description: 'Đăng nhập vào hệ thống sổ tiêm chủng điện tử VNCDC',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

**Test:**
```bash
npm run dev
# Open http://localhost:3000/login
# Verify:
# - Form renders correctly
# - Can type in fields
# - Show/hide password works
# - Submit with invalid credentials shows error
# (Don't test actual login yet - need valid credentials)
```

### Step 4.2: Migrate ChangePassword Page (Day 3-4)

**Copy from Vite:**
```bash
cp /Users/leo/Documents/tiem-chung/src/pages/ChangePassword.tsx src/app/change-password/page.tsx
```

**Update `src/app/change-password/page.tsx`:**

```typescript
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'  // ← Changed
import { apiService } from '@/lib/api'  // ← Changed
// ... update all imports to @/

export default function ChangePasswordPage() {
  const router = useRouter()  // ← Changed
  const [step, setStep] = useState(1)
  // ... rest of state

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // ... existing logic

    if (step === 3 && success) {
      // Redirect to login
      setTimeout(() => {
        router.push('/login')  // ← Changed
      }, 2000)
    }
  }

  // ... rest of component (keep UI same)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* ... exact same UI ... */}
    </div>
  )
}
```

**Test:**
```bash
# Open http://localhost:3000/change-password
# Verify:
# - Multi-step wizard renders
# - Can navigate between steps
# - Form validation works
# (Don't test actual OTP - need valid phone number)
```

### Step 4.3: Migrate PersonalInfo Page (Day 5-6)

**Copy from Vite:**
```bash
cp /Users/leo/Documents/tiem-chung/src/pages/PersonalInfo.tsx src/app/personal-info/page.tsx
```

**Update `src/app/personal-info/page.tsx`:**

```typescript
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'  // ← Changed
import { apiService } from '@/lib/api'  // ← Changed
import type { ThanhVien } from '@/types'  // ← Changed
// ... update all imports

export default function PersonalInfoPage() {
  const router = useRouter()  // ← Changed
  const [members, setMembers] = useState<ThanhVien[]>([])
  // ... rest of state

  const handleMemberClick = (memberId: number, doiTuongId: number) => {
    router.push(`/vaccination-history/${memberId}`, {
      state: { doiTuongId }  // Note: Next.js doesn't support state in push
    })
  }

  const handleLogout = () => {
    apiService.clearToken()
    router.push('/login')  // ← Changed
  }

  // ... rest of component

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ... exact same UI ... */}
    </div>
  )
}
```

**⚠️ Important Note:** Next.js App Router doesn't support passing state via `router.push()`.

**Solution: Use URL search params:**

```typescript
// PersonalInfo.tsx
const handleMemberClick = (memberId: number, doiTuongId: number) => {
  router.push(`/vaccination-history/${memberId}?doiTuongId=${doiTuongId}`)
}
```

```typescript
// VaccinationHistory page will read:
import { useSearchParams } from 'next/navigation'
const searchParams = useSearchParams()
const doiTuongId = searchParams.get('doiTuongId')
```

**Test:**
```bash
# Open http://localhost:3000/personal-info
# Should redirect to /login (no auth yet - OK)
# After Phase 5 (auth), test:
# - Member list loads
# - Search works
# - Sort works
# - Click member navigates to vaccination history
```

### Step 4.4: Migrate VaccinationHistory Page (Day 7-10) ⚠️ COMPLEX

**⚠️ This is the largest component (1,594 lines) - needs refactoring**

**Strategy: Split into sub-components first**

**Create component structure:**
```
src/app/vaccination-history/[memberId]/
├── page.tsx                          # Main page (Server Component wrapper)
├── VaccinationHistoryClient.tsx     # Client component wrapper
└── components/
    ├── PersonalInfoTab.tsx
    ├── OverviewTab.tsx
    ├── HistoryTab.tsx
    ├── ScheduleTab.tsx
    ├── AntigenMatrix.tsx
    ├── VaccineTimeline.tsx
    └── DoseSchedule.tsx
```

**Step 4.4.1: Create Main Page (Server Component)**

**`src/app/vaccination-history/[memberId]/page.tsx`:**
```typescript
import { VaccinationHistoryClient } from './VaccinationHistoryClient'

interface PageProps {
  params: Promise<{ memberId: string }>
  searchParams: Promise<{ doiTuongId?: string }>
}

export default async function VaccinationHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const { memberId } = await params
  const { doiTuongId } = await searchParams

  return (
    <VaccinationHistoryClient
      memberId={memberId}
      doiTuongId={doiTuongId}
    />
  )
}
```

**Step 4.4.2: Create Client Component Wrapper**

**`src/app/vaccination-history/[memberId]/VaccinationHistoryClient.tsx`:**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '@/lib/api'
import type { ThanhVienDetail, KhangNguyenRecord, VacxinRecord, PhacDoRecord } from '@/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PersonalInfoTab } from './components/PersonalInfoTab'
import { OverviewTab } from './components/OverviewTab'
import { HistoryTab } from './components/HistoryTab'
import { ScheduleTab } from './components/ScheduleTab'

interface Props {
  memberId: string
  doiTuongId?: string
}

export function VaccinationHistoryClient({ memberId, doiTuongId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [memberDetail, setMemberDetail] = useState<ThanhVienDetail | null>(null)
  const [khangNguyenData, setKhangNguyenData] = useState<KhangNguyenRecord[]>([])
  const [vacxinData, setVacxinData] = useState<VacxinRecord[]>([])
  const [phacDoData, setPhacDoData] = useState<PhacDoRecord[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Parallel API calls
        const [member, khangNguyen, vacxin, phacDo] = await Promise.all([
          apiService.getThanhVienDetail(Number(memberId)),
          apiService.getKhangNguyenHistory(Number(doiTuongId || memberId)),
          apiService.getVacxinHistory(Number(doiTuongId || memberId)),
          apiService.getPhacDoTiemChung(Number(doiTuongId || memberId)),
        ])

        setMemberDetail(member)
        setKhangNguyenData(khangNguyen.data || [])
        setVacxinData(vacxin.data || [])
        setPhacDoData(phacDo.data || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [memberId, doiTuongId])

  if (loading) {
    return <div>Loading...</div>  // TODO: Add skeleton
  }

  if (!memberDetail) {
    return <div>Member not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="personal-info">
          <TabsList>
            <TabsTrigger value="personal-info">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="history">Lịch sử tiêm</TabsTrigger>
            <TabsTrigger value="schedule">Phác đồ</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info">
            <PersonalInfoTab member={memberDetail} />
          </TabsContent>

          <TabsContent value="overview">
            <OverviewTab
              khangNguyenData={khangNguyenData}
              vacxinData={vacxinData}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab vacxinData={vacxinData} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleTab phacDoData={phacDoData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

**Step 4.4.3: Create Sub-Components**

**Create each tab as separate component:**

1. **`components/PersonalInfoTab.tsx`** (~150 lines)
   - Extract personal info display logic
   - Copy UI from original VaccinationHistory

2. **`components/OverviewTab.tsx`** (~300 lines)
   - Extract overview tab logic
   - Include AntigenMatrix component

3. **`components/HistoryTab.tsx`** (~400 lines)
   - Extract history tab logic
   - Include VaccineTimeline component

4. **`components/ScheduleTab.tsx`** (~300 lines)
   - Extract schedule tab logic
   - Include DoseSchedule component

**Example: PersonalInfoTab.tsx**

```typescript
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { ThanhVienDetail } from '@/types'

interface Props {
  member: ThanhVienDetail
}

export function PersonalInfoTab({ member }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Họ tên:</span> {member.ho_ten}
          </div>
          <div>
            <span className="font-semibold">Ngày sinh:</span> {member.ngay_sinh}
          </div>
          {/* ... more fields ... */}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Repeat for other tab components.**

**Test:**
```bash
# After completing all sub-components:
# Open http://localhost:3000/vaccination-history/123?doiTuongId=456
# Verify:
# - All tabs render
# - Data loads
# - No console errors
```

**⏱️ Time allocation:**
- Day 7: Create main page + client wrapper (4h)
- Day 8: PersonalInfoTab + OverviewTab (8h)
- Day 9: HistoryTab (8h)
- Day 10: ScheduleTab + testing (8h)

### Step 4.5: Commit Phase 4

```bash
git add .
git commit -m "feat: Phase 4 - Migrate all pages

- Migrate Login page with Next.js routing
- Migrate ChangePassword page
- Migrate PersonalInfo page
- Refactor VaccinationHistory into sub-components:
  - Split 1,594 lines into 4 tab components
  - Create PersonalInfoTab, OverviewTab, HistoryTab, ScheduleTab
  - Improve maintainability and code organization
- Update all routing to Next.js App Router
- Update all imports to @/ alias
- Replace React Router with Next.js navigation

Phase 4 complete (40 hours)
"
```

---

## PHASE 5: IMPLEMENT AUTHENTICATION MIDDLEWARE (Week 5)

**Goal:** Secure routes with server-side authentication

**Estimated effort:** 24 hours

### Step 5.1: Create Middleware

**Create `src/middleware.ts` (root level, not in app/):**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/change-password']

// Routes that should redirect to /personal-info if authenticated
const AUTH_ROUTES = ['/login', '/change-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie (will implement in Step 5.2)
  const token = request.cookies.get('auth-token')?.value

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))

  // Redirect to login if not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to personal-info if authenticated and trying to access auth routes
  if (token && isAuthRoute) {
    const personalInfoUrl = new URL('/personal-info', request.url)
    return NextResponse.redirect(personalInfoUrl)
  }

  // Allow request to proceed
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
```

### Step 5.2: Migrate localStorage → httpOnly Cookies

**⚠️ This is a breaking change - need to update API service**

**Update `src/lib/api.ts`:**

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';  // ← Add this dependency

// ... existing code

class ApiService {
  private axiosInstance: AxiosInstance;
  private static TOKEN_KEY = 'auth-token';  // ← Cookie name

  // ... constructor (keep same)

  // Token management - UPDATED to use cookies
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Set cookie (httpOnly can only be set server-side, so use Secure + SameSite)
      Cookies.set(ApiService.TOKEN_KEY, token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      // Also set in localStorage as backup (for backward compatibility during migration)
      localStorage.setItem(ApiService.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try cookie first
      let token = Cookies.get(ApiService.TOKEN_KEY);

      // Fallback to localStorage (for backward compatibility)
      if (!token) {
        token = localStorage.getItem(ApiService.TOKEN_KEY);
        if (token) {
          // Migrate to cookie
          this.setToken(token);
        }
      }

      return token || null;
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove(ApiService.TOKEN_KEY, { path: '/' });
      localStorage.removeItem(ApiService.TOKEN_KEY);
    }
  }

  // ... rest of methods (keep same)
}
```

**Install js-cookie:**
```bash
npm install js-cookie
npm install -D @types/js-cookie
```

### Step 5.3: Create Server Actions for Auth (Optional but Recommended)

**Create `src/app/actions/auth.ts`:**

```typescript
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-stc-v2.vncdc.gov.vn'

export async function loginAction(phoneNumber: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        pass: password,
        osType: 'web',
        osVersion: 'Next.js 15',
        deviceId: 'web-browser',
        notificationToken: '',
      }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    const token = data.token || data.data?.token || data.access_token || data.accessToken

    if (!token) {
      throw new Error('No token received')
    }

    // Set httpOnly cookie (more secure)
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  redirect('/login')
}
```

**Update Login page to use Server Actions (optional):**

```typescript
// src/app/login/page.tsx
'use client'

import { loginAction } from '@/app/actions/auth'
// ... other imports

export default function LoginPage() {
  const router = useRouter()
  // ... state

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Option 1: Use Server Action (more secure)
      const result = await loginAction(phoneNumber, password)

      if (result.success) {
        router.push('/personal-info')
        router.refresh() // Refresh to update middleware
      } else {
        setError(result.error || 'Đăng nhập thất bại')
      }

      // Option 2: Keep using API service (easier migration)
      // await apiService.login(phoneNumber, password)
      // router.push('/personal-info')
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  // ... rest of component
}
```

**Recommendation:** Use Server Actions for login/logout (more secure), but keep API service for other endpoints (easier migration).

### Step 5.4: Remove Old Route Guards

**Delete these files (no longer needed):**
- `src/components/ProtectedRoute.tsx` ✅ Remove
- `src/components/PublicRoute.tsx` ✅ Remove

**No longer needed because middleware handles routing.**

### Step 5.5: Update PersonalInfo Logout

**Update `src/app/personal-info/page.tsx`:**

```typescript
'use client'

import { logoutAction } from '@/app/actions/auth'  // ← Add this
// ... other imports

export default function PersonalInfoPage() {
  // ... existing code

  const handleLogout = async () => {
    // Option 1: Use Server Action
    await logoutAction()  // Will redirect to /login automatically

    // Option 2: Keep using API service (but also need to redirect)
    // apiService.clearToken()
    // router.push('/login')
    // router.refresh()
  }

  // ... rest of component
}
```

### Step 5.6: Test Authentication Flow

**Test checklist:**

```bash
# 1. Start development server
npm run dev

# 2. Test unauthenticated access
# - Open http://localhost:3000/personal-info
# - Should redirect to /login ✅

# 3. Test login
# - Go to http://localhost:3000/login
# - Enter valid credentials
# - Should redirect to /personal-info ✅
# - Check cookie is set (DevTools → Application → Cookies) ✅

# 4. Test authenticated access to auth routes
# - While logged in, go to http://localhost:3000/login
# - Should redirect to /personal-info ✅

# 5. Test logout
# - Click logout button
# - Should redirect to /login ✅
# - Cookie should be cleared ✅

# 6. Test page refresh (auth persistence)
# - Login
# - Refresh page
# - Should stay logged in ✅

# 7. Test direct URL access
# - While logged in, go to http://localhost:3000/vaccination-history/123
# - Should load page (not redirect) ✅

# 8. Test middleware on all routes
# - Try accessing /change-password while logged in
# - Should redirect to /personal-info ✅
```

### Step 5.7: Commit Phase 5

```bash
git add .
git commit -m "feat: Phase 5 - Implement authentication middleware

- Create Next.js middleware for route protection
- Migrate localStorage to httpOnly cookies (more secure)
- Create server actions for login/logout
- Remove old route guard components
- Update Login page to use cookies
- Update PersonalInfo logout to use server actions
- Test authentication flow end-to-end

Security improvements:
- httpOnly cookies prevent XSS token theft
- Server-side route protection
- Automatic redirect for unauthenticated users

Phase 5 complete (24 hours)
"
```

---

## PHASE 6: PWA & ANALYTICS (Week 6)

**Goal:** Restore PWA & analytics functionality

**Estimated effort:** 16 hours

### Step 6.1: Install next-pwa

```bash
npm install next-pwa
npm install -D webpack  # Peer dependency
```

### Step 6.2: Configure next-pwa

**Update `next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api-stc-v2\.vncdc\.gov\.vn\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
})

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-stc-v2.vncdc.gov.vn',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-stc-v2.vncdc.gov.vn',
  },
  experimental: {
    typedRoutes: true,
  },
  poweredByHeader: false,
  compress: true,
})

module.exports = nextConfig
```

### Step 6.3: Copy PWA Manifest

```bash
# Copy manifest.json from old project
cp /Users/leo/Documents/tiem-chung/public/manifest.json public/manifest.json
```

**Verify `public/manifest.json`:**
```json
{
  "name": "Sổ Tiêm Chủng Điện Tử - VNCDC",
  "short_name": "Sổ Tiêm Chủng",
  "description": "Hệ thống quản lý sổ tiêm chủng điện tử",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4F46E5",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["health", "medical", "lifestyle"],
  "lang": "vi",
  "scope": "/",
  "prefer_related_applications": false
}
```

**Copy icon files:**
```bash
cp /Users/leo/Documents/tiem-chung/public/icon-*.png public/
cp /Users/leo/Documents/tiem-chung/public/icon.svg public/
```

### Step 6.4: Add PWA Metadata to Layout

**Update `src/app/layout.tsx`:**

```typescript
import type { Metadata, Viewport } from "next";
// ... other imports

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  // ... existing metadata

  manifest: '/manifest.json',  // ← Add this

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sổ Tiêm Chủng',
  },

  // ... rest of metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api-stc-v2.vncdc.gov.vn" />
        <link rel="dns-prefetch" href="https://api-stc-v2.vncdc.gov.vn" />

        {/* PWA icons */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Step 6.5: Test PWA

**Test checklist:**

```bash
# 1. Build production version
npm run build
npm run start

# 2. Open http://localhost:3000 in Chrome
# 3. Open DevTools → Application → Service Workers
# - Should see service worker registered ✅

# 4. Check manifest
# - DevTools → Application → Manifest
# - Should see manifest details ✅

# 5. Test PWA installation
# - Chrome should show "Install" button in address bar ✅
# - Click Install
# - App should open in standalone window ✅

# 6. Test offline mode
# - DevTools → Network → Offline
# - Refresh page
# - Should show cached version ✅

# 7. Lighthouse PWA audit
# - DevTools → Lighthouse → PWA
# - Should score 100/100 ✅
```

### Step 6.6: Migrate Analytics

**Copy analytics.ts:**
```bash
cp /Users/leo/Documents/tiem-chung/src/lib/analytics.ts src/lib/analytics.ts
```

**Update `src/lib/analytics.ts` for Next.js:**

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'  // ← Changed

// ... keep all existing functions (initGA, initGTM, pageview, event, etc.)

// Update usePageTracking hook
export function usePageTracking() {
  const pathname = usePathname()  // ← Changed from useLocation
  const searchParams = useSearchParams()  // ← New

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      pageview(url, document.title)
    }
  }, [pathname, searchParams])
}
```

### Step 6.7: Add Analytics to Layout

**Update `src/app/layout.tsx`:**

```typescript
import { GoogleAnalytics, GoogleTagManager } from '@/components/Analytics'  // Will create
// ... other imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* ... existing head content ... */}
      </head>
      <body className={inter.className}>
        {children}

        {/* Analytics */}
        <GoogleAnalytics />
        <GoogleTagManager />
      </body>
    </html>
  );
}
```

**Create `src/components/Analytics.tsx`:**

```typescript
'use client'

import { useEffect } from 'react'
import { initGA, initGTM, usePageTracking } from '@/lib/analytics'

export function GoogleAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      initGA()
    }
  }, [])

  usePageTracking()

  return null
}

export function GoogleTagManager() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GTM_ID) {
      initGTM()
    }
  }, [])

  return null
}
```

### Step 6.8: Test Analytics

**Test checklist:**

```bash
# 1. Add GA/GTM IDs to .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# 2. Run development server
npm run dev

# 3. Open browser with Google Analytics Debugger extension
# 4. Navigate to different pages
# 5. Verify page views are tracked in:
# - GA4 Real-time reports
# - GTM Preview mode
# - Browser console (should see gtag/dataLayer events)

# 6. Test custom events
# - Login event
# - Logout event
# - Member view event
# - Search event

# 7. Verify no errors in console
```

### Step 6.9: Commit Phase 6

```bash
git add .
git commit -m "feat: Phase 6 - PWA & Analytics integration

- Install and configure next-pwa plugin
- Copy PWA manifest and icons
- Add PWA metadata to layout
- Configure service worker with caching strategies
- Migrate analytics.ts to Next.js
- Create Analytics components
- Add GA4 & GTM tracking
- Update usePageTracking hook for Next.js routing
- Test PWA installation and offline mode
- Test analytics tracking

PWA features:
- Offline support
- Install to home screen
- Push notifications ready
- Optimized caching

Phase 6 complete (16 hours)
"
```

---

## PHASE 7: OPTIMIZATION & TESTING (Week 7)

**Goal:** Optimize performance & add tests

**Estimated effort:** 32 hours

### Step 7.1: Optimize Images with next/image

**Find all `<img>` tags and replace with `<Image>`:**

```bash
# Search for img tags
grep -r "<img" src/

# Replace with next/image
# Example:
```

**Before:**
```typescript
<img src="/icon.svg" alt="Logo" className="h-12 w-12" />
```

**After:**
```typescript
import Image from 'next/image'

<Image
  src="/icon.svg"
  alt="Logo"
  width={48}
  height={48}
  className="h-12 w-12"
  priority  // For above-the-fold images
/>
```

**For remote images (API avatars):**
```typescript
{member.avatar && (
  <Image
    src={member.avatar}
    alt={member.ho_ten}
    width={100}
    height={100}
    className="rounded-full"
    unoptimized  // If API doesn't support Next.js image optimization
  />
)}
```

### Step 7.2: Optimize Fonts with next/font

**Already using `next/font` in layout.tsx:**
```typescript
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "vietnamese"] });
```

**If using custom fonts, add them:**
```typescript
import { Inter, Roboto } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: 'swap',
  variable: '--font-inter',
})

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['vietnamese'],
  display: 'swap',
  variable: '--font-roboto',
})
```

### Step 7.3: Add Loading States with Suspense

**Create loading.tsx for each route:**

**`src/app/personal-info/loading.tsx`:**
```typescript
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Similarly create loading.tsx for:**
- `src/app/login/loading.tsx`
- `src/app/vaccination-history/[memberId]/loading.tsx`

### Step 7.4: Add Error Boundaries

**Create error.tsx for each route:**

**`src/app/personal-info/error.tsx`:**
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('PersonalInfo error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Có lỗi xảy ra</AlertTitle>
        <AlertDescription>
          {error.message || 'Không thể tải dữ liệu. Vui lòng thử lại.'}
        </AlertDescription>
        <Button onClick={reset} className="mt-4">
          Thử lại
        </Button>
      </Alert>
    </div>
  )
}
```

**Create error.tsx for all routes.**

### Step 7.5: Add Unit Tests with Vitest

**Install Vitest:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @vitejs/plugin-react
```

**Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Create `vitest.setup.ts`:**
```typescript
import '@testing-library/jest-dom'
```

**Create example test: `src/lib/__tests__/utils.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'disabled')).toBe('base active')
  })
})
```

**Create component test: `src/components/ui/__tests__/button.test.tsx`:**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>Click me</Button>)

    await userEvent.click(screen.getByText('Click me'))
    expect(clicked).toBe(true)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })
})
```

**Add test script to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Run tests:**
```bash
npm run test
```

### Step 7.6: Add E2E Tests with Playwright

**Install Playwright:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Create `playwright.config.ts`:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Create `e2e/login.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Login flow', () => {
  test('should redirect to login page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')

    // Should show error (fields required)
    await expect(page.locator('text=required')).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login')
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()

    await page.click('button[aria-label="Toggle password visibility"]')
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })
})
```

**Add E2E test script:**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Run E2E tests:**
```bash
npm run test:e2e
```

### Step 7.7: Run Lighthouse Audit

**Install Lighthouse CI:**
```bash
npm install -D @lhci/cli
```

**Create `lighthouserc.json`:**
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run build && npm run start",
      "url": [
        "http://localhost:3000/login",
        "http://localhost:3000/personal-info"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "categories:pwa": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Add Lighthouse script:**
```json
{
  "scripts": {
    "lighthouse": "lhci autorun"
  }
}
```

**Run Lighthouse:**
```bash
npm run lighthouse
```

**Target scores:**
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- PWA: 100

### Step 7.8: Optimize Bundle Size

**Analyze bundle:**
```bash
npm install -D @next/bundle-analyzer
```

**Update `next.config.js`:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withPWA({
  // ... existing config
}))
```

**Run analyzer:**
```bash
ANALYZE=true npm run build
```

**Optimization opportunities:**
- Remove unused dependencies
- Dynamic imports for large components
- Tree-shake unused code
- Optimize images

### Step 7.9: Commit Phase 7

```bash
git add .
git commit -m "feat: Phase 7 - Optimization & Testing

- Optimize images with next/image
- Optimize fonts with next/font (already using)
- Add loading states with Suspense
- Add error boundaries for all routes
- Add unit tests with Vitest
  - Utils tests
  - Component tests
  - Test coverage setup
- Add E2E tests with Playwright
  - Login flow tests
  - Navigation tests
  - Form validation tests
- Run Lighthouse audit
  - Performance: 95+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 95+
  - PWA: 100
- Analyze and optimize bundle size

Test coverage: 60%+ (target)

Phase 7 complete (32 hours)
"
```

---

## PHASE 8: DEPLOYMENT (Week 8)

**Goal:** Deploy to production

**Estimated effort:** 16 hours

### Step 8.1: Choose Deployment Platform

**Options:**

1. **Vercel (Recommended - Next.js native)**
   - ✅ Zero-config deployment
   - ✅ Automatic HTTPS
   - ✅ Edge network
   - ✅ Built-in analytics
   - ✅ Preview deployments
   - ⚠️ Cost: Free tier → $20/month Pro

2. **Cloudflare Pages (Current hosting)**
   - ✅ Keep current domain
   - ✅ Free tier generous
   - ✅ Edge network
   - ⚠️ Requires adapter for Next.js
   - ⚠️ No built-in analytics

**Decision: Vercel (easier, better Next.js support)**

### Step 8.2: Setup Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Answer prompts:
# ? Set up and deploy "~/Documents/tiem-chung-nextjs"? [Y/n] y
# ? Which scope do you want to deploy to? <your-team>
# ? Link to existing project? [y/N] n
# ? What's your project's name? tiem-chung
# ? In which directory is your code located? ./
```

### Step 8.3: Configure Environment Variables

**Add environment variables to Vercel:**

```bash
# Via Vercel dashboard or CLI:
vercel env add NEXT_PUBLIC_API_BASE_URL production
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
vercel env add NEXT_PUBLIC_GTM_ID production
vercel env add NEXT_PUBLIC_APP_NAME production
vercel env add NEXT_PUBLIC_APP_URL production

# Values:
# NEXT_PUBLIC_API_BASE_URL=https://api-stc-v2.vncdc.gov.vn
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
# NEXT_PUBLIC_APP_NAME=Sổ Tiêm Chủng Điện Tử - VNCDC
# NEXT_PUBLIC_APP_URL=https://sotiemchung.vncdc.gov.vn
```

**Or via Vercel dashboard:**
- Go to Project Settings → Environment Variables
- Add each variable

### Step 8.4: Configure Custom Domain (Optional)

**If keeping `sotiemchung.vncdc.gov.vn` domain:**

1. **Add domain in Vercel:**
   - Project Settings → Domains
   - Add `sotiemchung.vncdc.gov.vn`

2. **Update DNS records:**
   ```
   Type: CNAME
   Name: sotiemchung
   Value: cname.vercel-dns.com
   ```

3. **Wait for SSL certificate (automatic)**

### Step 8.5: Deploy to Staging

```bash
# Deploy to preview environment
vercel

# Test staging URL
# https://tiem-chung-<hash>.vercel.app
```

**Test checklist:**
- [ ] App loads correctly
- [ ] Login works
- [ ] All pages accessible
- [ ] PWA installs
- [ ] Analytics tracking works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance good (Lighthouse)

### Step 8.6: Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy if configured)
git push origin migrate/nextjs-15
# Then merge to main
```

### Step 8.7: Setup 301 Redirects (If URLs Changed)

**If old Vite app had different URLs, add redirects:**

**Create `next.config.js` redirects:**
```javascript
module.exports = withPWA({
  // ... existing config

  async redirects() {
    return [
      // Example: if old app had /dashboard → /personal-info
      {
        source: '/dashboard',
        destination: '/personal-info',
        permanent: true, // 301 redirect
      },
      // Add more redirects as needed
    ]
  },
})
```

### Step 8.8: Monitor Deployment

**Setup monitoring:**

1. **Vercel Analytics (Built-in)**
   - Enable in Project Settings → Analytics
   - Free tier: 100k events/month

2. **Error Monitoring (Sentry - Optional)**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Uptime Monitoring (UptimeRobot - Free)**
   - Add URL: https://sotiemchung.vncdc.gov.vn
   - Check interval: 5 minutes
   - Alert via email/SMS

### Step 8.9: Post-Deployment Checklist

**Verify production:**

```bash
# 1. Open production URL
https://sotiemchung.vncdc.gov.vn

# 2. Run Lighthouse audit
# - Open Chrome DevTools
# - Lighthouse → Generate report
# - Target: 95+ on all metrics

# 3. Test on real devices
# - iOS Safari
# - Android Chrome
# - Desktop Chrome/Firefox/Safari

# 4. Test PWA installation
# - Click "Install" button
# - Verify app works offline

# 5. Verify analytics
# - GA4 Real-time
# - GTM Preview
# - Vercel Analytics

# 6. Check error logs
# - Vercel dashboard → Logs
# - Sentry dashboard (if setup)

# 7. Load testing (optional)
# - Use tools like k6 or Artillery
# - Simulate 100+ concurrent users

# 8. Security audit
# - https://observatory.mozilla.org/
# - Check SSL certificate
# - Check security headers
```

### Step 8.10: Rollback Plan (If Needed)

**If migration fails in production:**

1. **Quick rollback to Vite app:**
   ```bash
   # Revert DNS to old Cloudflare Pages deployment
   # Or point domain back to old deployment
   ```

2. **Investigate issues:**
   - Check Vercel logs
   - Check browser console
   - Check API connectivity
   - Check authentication flow

3. **Fix and redeploy:**
   ```bash
   # Fix issues locally
   git commit -m "fix: production issues"
   vercel --prod
   ```

### Step 8.11: Commit Phase 8

```bash
git add .
git commit -m "feat: Phase 8 - Production deployment

- Setup Vercel project
- Configure environment variables
- Deploy to staging
- QA testing on staging
- Deploy to production
- Setup custom domain
- Configure 301 redirects (if needed)
- Setup monitoring (Vercel Analytics + UptimeRobot)
- Post-deployment verification
- Lighthouse audit: Performance 95+, SEO 95+, PWA 100

Production URL: https://sotiemchung.vncdc.gov.vn

Phase 8 complete (16 hours)
"
```

---

## 10. POST-MIGRATION TASKS

### 10.1: Documentation Update

**Update README.md:**
```markdown
# Sổ Tiêm Chủng Điện Tử - VNCDC

## Tech Stack (After Migration)
- **Framework:** Next.js 15.4
- **React:** 19.x
- **TypeScript:** 5.9
- **Styling:** Tailwind CSS v3
- **UI Components:** shadcn/ui
- **PWA:** next-pwa
- **Analytics:** Google Analytics 4 + GTM
- **Deployment:** Vercel
- **Testing:** Vitest + Playwright

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lighthouse` - Run Lighthouse audit

## Deployment
Automatic deployment via Vercel on push to main branch.
```

**Update DEPLOYMENT.md:**
```markdown
# Deployment Guide (Next.js 15)

## Vercel Deployment

### First-time Setup
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`

### Deploy to Production
\`\`\`bash
git push origin main
# Auto-deploys via Vercel GitHub integration
\`\`\`

### Environment Variables
Set in Vercel dashboard:
- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_GA_MEASUREMENT_ID
- NEXT_PUBLIC_GTM_ID

## Custom Domain
Configured: sotiemchung.vncdc.gov.vn

## Monitoring
- Vercel Analytics: https://vercel.com/dashboard
- UptimeRobot: https://uptimerobot.com/
```

### 10.2: Team Training

**Create migration knowledge transfer doc:**

**`MIGRATION_SUMMARY.md`:**
```markdown
# Migration Summary: Vite → Next.js 15

## Key Changes for Developers

### Routing
- **Before:** React Router (`useNavigate()`)
- **After:** Next.js App Router (`useRouter()` from 'next/navigation')

### File Structure
- **Before:** `src/pages/*.tsx`
- **After:** `src/app/*/page.tsx` (file-based routing)

### Imports
- **Before:** Relative imports `../../components/ui/button`
- **After:** Alias imports `@/components/ui/button`

### Authentication
- **Before:** React Context + localStorage
- **After:** Next.js Middleware + httpOnly cookies

### Environment Variables
- **Before:** `import.meta.env.VITE_*`
- **After:** `process.env.NEXT_PUBLIC_*`

### Data Fetching
- **Before:** Client-side only (useEffect + axios)
- **After:** Server Components + Client Components (optional)

### Build & Deploy
- **Before:** `npm run build` → Cloudflare Pages
- **After:** `npm run build` → Vercel (auto-deploy)

## New Features Available

### Server Components
\`\`\`typescript
// app/personal-info/page.tsx
async function PersonalInfoPage() {
  const members = await fetchMembers() // Server-side
  return <MemberList initialData={members} />
}
\`\`\`

### Server Actions
\`\`\`typescript
'use server'
export async function loginAction(phone, password) {
  // Server-side authentication
}
\`\`\`

### Loading States
\`\`\`typescript
// app/personal-info/loading.tsx
export default function Loading() {
  return <Skeleton />
}
\`\`\`

### Error Boundaries
\`\`\`typescript
// app/personal-info/error.tsx
export default function Error({ error, reset }) {
  return <ErrorDisplay error={error} onRetry={reset} />
}
\`\`\`

## Migration Checklist for New Features

- [ ] Use `'use client'` for interactive components
- [ ] Use `@/` imports instead of relative paths
- [ ] Use `useRouter()` from 'next/navigation'
- [ ] Use Server Components when possible (no 'use client')
- [ ] Add loading.tsx for better UX
- [ ] Add error.tsx for error handling
- [ ] Write tests (unit + E2E)
- [ ] Run Lighthouse audit before deploying
```

### 10.3: Performance Monitoring Setup

**Create performance monitoring dashboard:**

1. **Vercel Analytics**
   - Track Core Web Vitals
   - Monitor page load times
   - Track user interactions

2. **Google Analytics 4**
   - Custom events
   - User flows
   - Conversion tracking

3. **Sentry (Optional)**
   - Error tracking
   - Performance monitoring
   - Release tracking

### 10.4: Cleanup Old Code

**Remove Vite-specific files:**
```bash
# Old Vite project
cd /Users/leo/Documents/tiem-chung

# Archive old project (don't delete immediately)
cd ..
tar -czf tiem-chung-vite-backup.tar.gz tiem-chung

# Rename new project
mv tiem-chung-nextjs tiem-chung

# Verify new project works
cd tiem-chung
npm run dev
```

**Remove unused dependencies:**
```bash
# Remove Vite-specific packages
npm uninstall vite @vitejs/plugin-react

# Remove React Router
npm uninstall react-router-dom

# Audit dependencies
npm audit
npm audit fix
```

### 10.5: Final Migration Report

**Create `MIGRATION_REPORT.md`:**
```markdown
# Migration Report: Vite → Next.js 15

**Migration completed:** [Date]
**Duration:** 7 weeks
**Total effort:** 188 hours

## Metrics Comparison

| Metric | Before (Vite) | After (Next.js) | Improvement |
|--------|--------------|----------------|-------------|
| Lighthouse Performance | 85 | 96 | +12.9% |
| First Contentful Paint | 2.0s | 1.1s | -45% |
| Largest Contentful Paint | 4.0s | 2.2s | -45% |
| Time to Interactive | 3.5s | 2.3s | -34.3% |
| Bundle Size (First Load) | 250KB | 165KB | -34% |
| Build Time | 20s | 12s | -40% |
| SEO Score | 85 | 98 | +15.3% |
| PWA Score | 90 | 100 | +11.1% |

## Features Added

✅ Server-Side Rendering (SSR)
✅ Server Components
✅ Middleware Authentication
✅ httpOnly Cookies (more secure)
✅ Automatic Code Splitting
✅ Image Optimization
✅ Font Optimization
✅ Loading States (Suspense)
✅ Error Boundaries
✅ Unit Tests (Vitest)
✅ E2E Tests (Playwright)
✅ PWA (next-pwa)
✅ Analytics (GA4 + GTM)

## Code Quality Improvements

- Reduced component size (VaccinationHistory: 1,594 → 4 components @ ~400 lines each)
- Added TypeScript strict mode
- Added ESLint Next.js rules
- Added test coverage (60%+)
- Improved error handling
- Better loading states

## Known Issues & Future Work

- [ ] Add more unit tests (target: 80% coverage)
- [ ] Add visual regression tests
- [ ] Implement dark mode toggle
- [ ] Add internationalization (i18n)
- [ ] Optimize for slower networks
- [ ] Add progressive image loading

## Lessons Learned

1. **Start with foundation** - Setting up Next.js properly saves time later
2. **Migrate incrementally** - Phase-by-phase approach reduced risk
3. **Test early, test often** - Caught issues before production
4. **Authentication is critical** - Spent extra time on security
5. **PWA setup is complex** - next-pwa plugin saved significant time

## Recommendations

- Continue monitoring performance metrics
- Add more tests as features are added
- Consider migrating to Server Actions for all API calls
- Implement dark mode
- Add more accessibility features
```

---

## 11. ROLLBACK PLAN

**If migration fails at any phase:**

### Immediate Rollback (Production)

1. **DNS rollback (5 minutes):**
   ```bash
   # Point domain back to old Cloudflare Pages deployment
   # Update CNAME record:
   # sotiemchung.vncdc.gov.vn → old-deployment.pages.dev
   ```

2. **Restore old Vite app:**
   ```bash
   cd /Users/leo/Documents
   tar -xzf tiem-chung-vite-backup.tar.gz
   cd tiem-chung
   npm run build
   npm run deploy  # Deploy to Cloudflare Pages
   ```

3. **Verify old app works:**
   ```bash
   # Test critical flows:
   # - Login
   # - View members
   # - View vaccination history
   ```

### Partial Rollback (Feature-specific)

**If specific feature fails:**

1. **Authentication issues:**
   - Revert middleware.ts
   - Restore AuthContext
   - Restore localStorage token handling

2. **Routing issues:**
   - Check middleware matcher
   - Check route protection logic
   - Verify redirects

3. **API issues:**
   - Check CORS settings
   - Verify API base URL
   - Check token handling

### Prevention Measures

**To avoid rollback:**

- ✅ Test each phase thoroughly before moving to next
- ✅ Use feature flags for gradual rollout
- ✅ Monitor error rates closely
- ✅ Have staging environment
- ✅ Keep old deployment running during migration
- ✅ Use blue-green deployment strategy

---

## 12. TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### Issue 1: "Hydration failed" Error

**Symptom:** Error in console about hydration mismatch

**Cause:** Server-rendered HTML doesn't match client-rendered HTML

**Solution:**
```typescript
// Use dynamic import with ssr: false
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
})
```

#### Issue 2: "Cannot access localStorage" in Server Component

**Symptom:** Error about localStorage not defined

**Cause:** Trying to use browser API in Server Component

**Solution:**
```typescript
// Add 'use client' directive
'use client'

import { useState, useEffect } from 'react'

export default function MyComponent() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Safe to use localStorage here
    setToken(localStorage.getItem('token'))
  }, [])
}
```

#### Issue 3: Middleware Not Working

**Symptom:** Routes not protected, redirects not working

**Cause:** Middleware not running or matcher config wrong

**Solution:**
```typescript
// Check middleware.ts is in root (not in app/)
// Check matcher config:
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

#### Issue 4: Environment Variables Not Working

**Symptom:** `process.env.NEXT_PUBLIC_*` is undefined

**Cause:** Missing `NEXT_PUBLIC_` prefix or not in .env.local

**Solution:**
```bash
# .env.local (must have NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# Restart dev server after adding env vars
npm run dev
```

#### Issue 5: PWA Not Installing

**Symptom:** Install button doesn't appear

**Cause:** Missing manifest.json or service worker not registered

**Solution:**
```typescript
// Verify next.config.js has withPWA wrapper
// Verify manifest.json in public/
// Verify icons exist
// Build and test:
npm run build
npm run start  # Not npm run dev (PWA disabled in dev)
```

#### Issue 6: Authentication Loop (Infinite Redirects)

**Symptom:** Page keeps redirecting between /login and /personal-info

**Cause:** Middleware logic bug or cookie not set correctly

**Solution:**
```typescript
// Check middleware.ts logic:
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // Add logging
  console.log('[Middleware]', request.nextUrl.pathname, 'Token:', !!token)

  // Fix logic
  const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname)

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/personal-info', request.url))
  }

  return NextResponse.next()
}
```

---

## 🎯 MIGRATION SUCCESS CRITERIA

**Migration considered successful when:**

✅ **Functionality:**
- [ ] All pages render correctly
- [ ] Login/logout works
- [ ] Member list loads and displays
- [ ] Vaccination history shows all data
- [ ] Search/filter works
- [ ] Password recovery flow works
- [ ] All links navigate correctly

✅ **Performance:**
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Lighthouse PWA = 100
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.0s

✅ **Security:**
- [ ] httpOnly cookies working
- [ ] Middleware protecting routes
- [ ] No XSS vulnerabilities
- [ ] HTTPS enabled
- [ ] Security headers configured

✅ **Testing:**
- [ ] Unit test coverage ≥ 60%
- [ ] E2E tests passing
- [ ] Manual QA completed
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed

✅ **DevOps:**
- [ ] Production deployment successful
- [ ] Monitoring setup (analytics + errors)
- [ ] Rollback plan documented
- [ ] Team trained on new stack

✅ **Documentation:**
- [ ] README updated
- [ ] DEPLOYMENT.md updated
- [ ] Migration report created
- [ ] Troubleshooting guide created

---

## 📞 SUPPORT & ESCALATION

**If you encounter issues during migration:**

1. **Check this plan:** Most common issues are documented
2. **Check Next.js docs:** https://nextjs.org/docs
3. **Check GitHub issues:** https://github.com/vercel/next.js/issues
4. **Stack Overflow:** Tag with `next.js` + `react` + `typescript`
5. **Vercel Discord:** https://discord.gg/vercel

**Escalation path:**
1. Try troubleshooting guide
2. Consult team senior developer
3. Post question on Stack Overflow
4. Contact Vercel support (if using Vercel)

---

## ✅ FINAL CHECKLIST

Before marking migration as complete:

- [ ] All 8 phases completed
- [ ] All tests passing
- [ ] Production deployment successful
- [ ] Monitoring setup
- [ ] Documentation updated
- [ ] Team trained
- [ ] Old codebase archived
- [ ] Migration report created
- [ ] Success criteria met
- [ ] Stakeholders notified

**Congratulations on completing the migration! 🎉**

---

**End of Migration Plan**

**Next step:** Create git branch và bắt đầu implement Phase 1.
