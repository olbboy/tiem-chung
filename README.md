# Sổ Tiêm Chủng Điện Tử 💉

> Modern web application for managing Vietnamese vaccination records with a beautiful UI/UX

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Educational-green)]()

Web application for viewing and managing vaccination records from the Vietnamese National Center for Disease Control (VNCDC). Built with modern technologies and designed with Vietnamese users in mind.

---

## ✨ Features

### 🔐 Authentication & Security
- **Phone-based Login**: Secure authentication using phone number and password
- **OTP Recovery**: 3-step password recovery with SMS verification
- **JWT Tokens**: Secure session management with automatic expiration
- **Protected Routes**: Authorization guards for sensitive pages

### 👥 Family Management
- **Multi-member Support**: Manage vaccination records for entire family
- **Member Profiles**: Detailed personal information for each member
- **Search & Filter**: Quickly find members by name, phone, or email
- **Smart Sorting**: Sort by name (A-Z, Z-A) or date (newest/oldest)
- **Real-time Updates**: Refresh button to sync latest data

### 💉 Vaccination Tracking

#### Overview Tab
- **Visual Statistics**: Total doses, completed, pending, completion rate
- **Antigen Matrix**: Interactive table showing status by antigen and dose
- **Progress Tracking**: Visual progress bars for each vaccine series
- **Real-time Status**: Color-coded indicators for vaccination status

#### History Tab
- **Timeline View**: Chronological vaccination history grouped by year
- **Detailed Records**: Complete information for each dose including:
  - Vaccine name and antigen type
  - Date, time, and healthcare facility
  - Lot number and healthcare provider
  - Adverse reactions (if any)
- **Search Functionality**: Filter by vaccine name, antigen, or facility
- **Year Grouping**: Organized by year for easy navigation

#### Schedule Tab (Phác Đồ)
- **Age Timeline**: View schedule by age milestones (newborn → adult)
- **Antigen View**: Organize by vaccine type with completion tracking
- **Disease Information**: Educational content about preventable diseases
- **Visual Progress**: Clear indicators for completed vs pending doses

### 🎨 Modern UI/UX
- **Gradient Design**: Beautiful blue-indigo-purple color scheme
- **Glass-morphism**: Semi-transparent cards with backdrop blur effects
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive**: Perfect on mobile, tablet, and desktop
- **Vietnamese-first**: Fully localized with proper Vietnamese typography
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

---

## 🏗️ Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks and concurrent rendering
- **TypeScript 5.9**: Type-safe development with full IDE support
- **Vite 7.1**: Lightning-fast build tool and dev server
- **React Router v7**: Client-side routing with nested routes
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Lucide React**: Beautiful, consistent icon library

### State Management
- **React Context API**: Authentication and global state
- **Local Storage**: Persistent JWT token storage
- **React Hooks**: useState, useEffect, useMemo, useCallback

### API & Data
- **Axios**: HTTP client with interceptors and error handling
- **VNCDC API**: Official Vietnamese vaccination database
- **JWT Authentication**: Bearer token-based security

### Build & Deployment
- **Vite**: Fast HMR and optimized production builds
- **Cloudflare Pages**: Global CDN with edge functions
- **PWA Support**: Service worker for offline capabilities

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Compile-time type checking
- **PostCSS**: CSS processing and optimization

### Analytics
- **Google Analytics 4**: User behavior tracking
- **Google Tag Manager**: Tag management system
- **Custom Events**: Detailed user interaction tracking

---

## 📁 Project Structure

```
tiem-chung/
├── public/                    # Static assets
│   ├── sw.js                 # Service worker for PWA
│   ├── manifest.json         # PWA manifest
│   ├── icon.svg             # Application icon (SVG)
│   └── _redirects           # Cloudflare SPA routing
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui-inspired components
│   │   │   ├── alert.tsx   # Alert notifications
│   │   │   ├── badge.tsx   # Status badges
│   │   │   ├── button.tsx  # Action buttons
│   │   │   ├── card.tsx    # Content cards
│   │   │   ├── dialog.tsx  # Modal dialogs
│   │   │   ├── skeleton.tsx # Loading placeholders
│   │   │   └── tabs.tsx    # Tab navigation
│   │   ├── ProtectedRoute.tsx  # Auth guard for private routes
│   │   └── PublicRoute.tsx     # Guard for public routes
│   │
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication state management
│   │
│   ├── lib/               # Utility libraries
│   │   ├── analytics.ts   # Google Analytics integration
│   │   └── utils.ts       # Helper functions
│   │
│   ├── pages/            # Page components (routes)
│   │   ├── Login.tsx              # Login page
│   │   ├── ChangePassword.tsx     # Password recovery (3 steps)
│   │   ├── PersonalInfo.tsx       # Member management dashboard
│   │   └── VaccinationHistory.tsx # Vaccination records
│   │
│   ├── services/         # API service layer
│   │   └── api.ts       # Axios client and API methods
│   │
│   ├── types/           # TypeScript definitions
│   │   └── index.ts     # API response types
│   │
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles (Tailwind)
│
├── docs/                # Documentation
│   ├── PROJECT_DESCRIPTION.md     # Comprehensive project overview
│   ├── ANALYTICS_SETUP.md         # GA/GTM setup guide
│   ├── VIETNAMESE_TEXT_FIXES.md   # Language guide
│   └── ICON_CREATION_GUIDE.md     # Icon design guide
│
├── index.html           # HTML entry point with GA/GTM
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

**Required:**
- **Node.js** 18+ and npm
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

**Optional:**
- **VS Code** with extensions:
  - ESLint
  - TypeScript
  - Tailwind CSS IntelliSense

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tiem-chung

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Development Scripts

```bash
# Development server with hot reload
npm run dev

# Type check
tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

### Environment Setup (Optional)

Create a `.env` file for Google Analytics:

```env
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXXX
```

See [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md) for detailed instructions.

---

## 🔌 API Integration

### Base URL
```
https://api-stc-v2.vncdc.gov.vn
```

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth` | User login | No |
| GET | `/thanh_vien?theo_doi=1` | Get member list | Yes |
| GET | `/thanh_vien/:id` | Get member details | Yes |
| GET | `/lich_su_tiem/khang_nguyen?doi_tuong_id=:id` | Get antigen history | Yes |
| GET | `/lich_su_tiem/vacxin?doi_tuong_id=:id` | Get vaccine history | Yes |
| GET | `/phac_do_tiem_chung?doi_tuong_id=:id` | Get vaccination schedule | Yes |
| POST | `/recover_pass_by_sms?phoneNumber=:phone` | Request OTP | No |
| POST | `/activate` | Verify OTP | No |
| POST | `/change_pass_by_token` | Change password | Yes (temp token) |

### Request Headers

All authenticated requests include:
```typescript
{
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'vi',
  'content-type': 'application/json;charset=UTF-8',
  'authorization': 'Bearer <JWT_TOKEN>'
}
```

### Response Handling

```typescript
// Successful response
{
  "code": 1,
  "message": "Thành công",
  "data": { /* response data */ }
}

// Error response
{
  "code": 0,
  "message": "Error message in Vietnamese"
}
```

---

## 📱 Usage Guide

### For End Users

**1. Login**
- Enter your phone number (e.g., 0912345678)
- Enter your password
- Click "Đăng nhập ngay"

**2. View Family Members**
- See all members under your account
- Use search to find specific members
- Sort by name or date

**3. View Vaccination History**
- Click on any member card
- Explore 4 tabs:
  - **Thông tin**: Personal details
  - **Tổng quan**: Vaccination overview
  - **Lịch sử**: Detailed history timeline
  - **Lịch trình**: Vaccination schedule

**4. Forgot Password?**
- Click "Quên mật khẩu?" on login page
- Enter phone number
- Enter OTP from SMS
- Set new password

### For Developers

See comprehensive guides in the `/docs` folder:
- [PROJECT_DESCRIPTION.md](./docs/PROJECT_DESCRIPTION.md) - Full project overview
- [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md) - Analytics configuration
- [VIETNAMESE_TEXT_FIXES.md](./VIETNAMESE_TEXT_FIXES.md) - Language guidelines
- [ICON_CREATION_GUIDE.md](./ICON_CREATION_GUIDE.md) - Icon design guide

---

## 🔒 Security

### Authentication
- **JWT Tokens**: Stored in localStorage with automatic refresh
- **Token Expiration**: Automatic logout on 401 errors
- **Secure Transmission**: HTTPS only for all API calls

### Data Protection
- **No Sensitive Data in URLs**: Query params don't expose PII
- **Client-side Validation**: Input sanitization before API calls
- **OTP-based Recovery**: Secure password reset flow

### Best Practices
- HTTPS enforced
- Content Security Policy ready
- CORS handled by API server
- XSS protection via React's built-in escaping

---

## 🎯 Development Guidelines

### Code Style

**TypeScript**
```typescript
// Use interfaces for object shapes
interface User {
  id: number;
  name: string;
}

// Use types for unions/intersections
type Status = 'pending' | 'completed';

// Always type function parameters and return values
function getUser(id: number): Promise<User> {
  // ...
}
```

**React Components**
```typescript
// Use function components with hooks
export const MyComponent = ({ prop }: Props) => {
  const [state, setState] = useState<StateType>(initial);
  
  return (
    <div>{/* JSX */}</div>
  );
};
```

**Tailwind CSS**
```tsx
// Use utility classes, avoid inline styles
<div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
```

### Component Structure

```
Component/
├── Component.tsx      # Main component logic
├── Component.types.ts # TypeScript types (if complex)
└── Component.test.tsx # Unit tests (future)
```

### State Management

**✅ Do:**
- Use Context for global auth state
- Use useState for local component state
- Use useMemo for expensive calculations
- Use useCallback for function props

**❌ Don't:**
- Don't overuse Context (prop drilling is OK for 2-3 levels)
- Don't store derived state
- Don't mutate state directly

### Error Handling

```typescript
try {
  const data = await apiService.getData();
  // Success handling
} catch (error: any) {
  console.error('[Component] Error:', error);
  const message = error.message || 'Default error message';
  setError(message);
  // Optional: Track error in analytics
  trackError(message, 'component-name');
}
```

---

## 🚀 Deployment

### Cloudflare Pages (Recommended)

**Why Cloudflare Pages?**
- ✅ Global CDN (instant worldwide delivery)
- ✅ Automatic HTTPS
- ✅ Git-based deployments
- ✅ Zero configuration
- ✅ Free tier (generous limits)

**Setup Steps:**

1. **Connect Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub/GitLab account
   - Select this repository

2. **Configure Build**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave empty)
   Deploy command: (LEAVE EMPTY!)
   ```

3. **Environment Variables** (Optional)
   ```
   VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX
   VITE_GTM_ID = GTM-XXXXXXX
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `https://your-project.pages.dev`

**Custom Domain:**
- Go to project settings → Custom domains
- Add your domain (e.g., `sotiemchung.vncdc.gov.vn`)
- Update DNS records as instructed
- SSL certificate is automatic

### Alternative Platforms

**Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Static Hosting (Nginx)**
```bash
npm run build
# Upload dist/ folder to your server
# Configure nginx to serve dist/index.html
```

### Important Files for Deployment

**`public/_redirects`** - SPA routing
```
/*    /index.html   200
```

**`dist/`** - Build output (git ignored)
- Optimized bundles
- Minified CSS/JS
- Copied public assets

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Can't connect to API"**
```
Solutions:
1. Check internet connection
2. Verify API is accessible: https://api-stc-v2.vncdc.gov.vn
3. Check browser console for CORS errors
4. Clear cache and reload (Ctrl+Shift+R)
```

**Issue: "Login failed"**
```
Solutions:
1. Verify phone number format (10 digits, starting with 0)
2. Check password (no spaces)
3. Try password recovery
4. Check API status
```

**Issue: "Token expired"**
```
Solutions:
1. Logout and login again
2. Clear localStorage: localStorage.clear()
3. Check system clock (JWT uses timestamps)
```

**Issue: "Build failed"**
```
Solutions:
1. Delete node_modules and package-lock.json
2. Run: npm install
3. Check Node.js version: node -v (must be 18+)
4. Run: npm run build locally to see errors
```

**Issue: "White screen / blank page"**
```
Solutions:
1. Check browser console for errors
2. Verify build was successful
3. Check _redirects file exists
4. Clear browser cache
5. Try different browser
```

### Performance Issues

**Slow Load Times**
```
Checklist:
□ Check internet speed
□ Check Lighthouse score
□ Optimize images
□ Enable compression
□ Use CDN (Cloudflare)
□ Check bundle size: npm run build -- --report
```

**Memory Issues**
```
Solutions:
□ Close unnecessary tabs
□ Reload page
□ Check for memory leaks in components
□ Use React DevTools Profiler
```

---

## 📊 Performance Metrics

### Current Performance

✅ **Lighthouse Scores** (Target)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90
- PWA: Ready

✅ **Bundle Sizes**
- Initial JS: ~150KB gzipped
- Initial CSS: ~20KB gzipped
- Total First Load: ~200KB

✅ **Load Times** (3G Network)
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

### Optimization Techniques Used

- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Unused code removed
- **Minification**: All JS/CSS minified
- **Compression**: Gzip/Brotli on server
- **Image Optimization**: SVG icons used
- **Caching**: Service worker for offline support
- **CDN**: Cloudflare global distribution

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following code style guidelines
4. **Test thoroughly** on multiple devices/browsers
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev

# Check types and lint
npm run lint
tsc --noEmit

# Commit with meaningful message
git add .
git commit -m "feat: add search functionality to member list"

# Push and create PR
git push origin feature/new-feature
```

### Commit Message Convention

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Build/tooling changes

Examples:
```
feat(auth): add OTP-based password recovery
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(button): improve hover animation
refactor(types): simplify API response types
```

---

## 📝 License

This project is for **educational and demonstration purposes**. 

The vaccination data is provided by VNCDC (Vietnamese National Center for Disease Control) and remains their property.

---

## 🙏 Acknowledgments

- **VNCDC**: For providing the API and vaccination data
- **Vietnamese Government**: For supporting digital healthcare initiatives
- **React Team**: For the amazing framework
- **Vite Team**: For the lightning-fast build tool
- **Tailwind Labs**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon library
- **Open Source Community**: For countless libraries and tools

---

## 📞 Support & Contact

### For Users
- **Technical Issues**: Check [Troubleshooting](#-troubleshooting) section
- **VNCDC Support**: Contact your healthcare facility
- **Bug Reports**: Open an issue on GitHub

### For Developers
- **Documentation**: See `/docs` folder
- **API Questions**: Refer to [API Integration](#-api-integration)
- **Code Questions**: Open a GitHub Discussion

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅ (Complete)
- [x] User authentication
- [x] Member management
- [x] Vaccination history
- [x] Schedule view
- [x] Password recovery
- [x] Responsive design
- [x] PWA support

### Phase 2: Enhancements 🚧 (In Progress)
- [ ] Push notifications for upcoming vaccinations
- [ ] QR code generation for vaccination certificates
- [ ] Export records as PDF
- [ ] Dark mode toggle
- [ ] Multi-language support (English)

### Phase 3: Advanced Features 🔮 (Planned)
- [ ] Appointment booking
- [ ] Health insurance integration
- [ ] AI-powered vaccine recommendations
- [ ] Family sharing and permissions
- [ ] Healthcare provider portal
- [ ] Offline-first with sync

---

## 📈 Analytics & Monitoring

This application uses Google Analytics 4 and Google Tag Manager for:
- **User Behavior**: Page views, sessions, events
- **Performance**: Load times, errors
- **Conversions**: Login success, member views
- **Demographics**: Device, browser, location

See [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md) for configuration details.

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star ⭐

---

<div align="center">

**Made with ❤️ for the Vietnamese healthcare community**

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues) · [Documentation](./docs/)

</div>

---

**Version**: 1.0.0  
**Last Updated**: October 25, 2025  
**Status**: ✅ Production Ready
