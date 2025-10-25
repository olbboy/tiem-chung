# Sổ Tiêm Chủng Điện Tử - VNCDC
## Vietnamese National Vaccination Record Management System

---

## 📋 Executive Summary

**Sổ Tiêm Chủng Điện Tử** is a modern, user-friendly web application that empowers Vietnamese citizens to manage and track vaccination records digitally. Built with cutting-edge technologies and integrated with the Vietnamese National Center for Disease Control (VNCDC) API, this platform provides real-time access to comprehensive vaccination history, personalized schedules, and healthcare information.

---

## 🎯 Project Vision

To provide every Vietnamese citizen with instant, secure, and comprehensive access to their vaccination records, supporting public health initiatives and personal health management through a beautifully designed, accessible digital platform.

---

## 👥 Target Audience

### Primary Users
- **Parents & Caregivers**: Managing vaccination records for children and family members
- **Adults**: Tracking personal vaccination history and schedules
- **Healthcare-Conscious Individuals**: Monitoring immunization compliance and health status

### User Demographics
- Age Range: 18-65+ years
- Location: Vietnam (nationwide)
- Device Usage: Mobile-first (70%), Desktop (30%)
- Technical Proficiency: Basic to intermediate

---

## ✨ Core Features

### 1. **Secure Authentication**
- Phone number-based login system
- JWT token authentication
- OTP-based password recovery
- Secure session management
- Auto-logout on token expiration

### 2. **Multi-Member Management**
- **Family Dashboard**: Manage vaccination records for entire family
- **Member Profiles**: Detailed personal information for each family member
- **Quick Access**: One-click navigation to individual vaccination histories
- **Status Tracking**: Real-time vaccination status for all members

### 3. **Comprehensive Vaccination History**

#### **Overview Tab**
- **Visual Statistics Dashboard**:
  - Total doses administered
  - Completed vaccinations
  - Pending vaccinations
  - Completion rate percentage
- **Antigen-Based Matrix**: Interactive table showing vaccination status by antigen and dose number
- **Progress Tracking**: Visual progress bars for each vaccine series

#### **History Tab**
- **Timeline View**: Chronological vaccination history grouped by year
- **Detailed Records**: Complete information for each vaccination including:
  - Vaccine name and manufacturer
  - Antigen type
  - Date and time of administration
  - Healthcare facility
  - Lot number
  - Healthcare provider name
  - Adverse reactions (if any)
- **Search & Filter**: Real-time search across vaccines, antigens, and facilities
- **Visual Timeline**: Beautiful timeline with icons and color coding

#### **Schedule Tab (Phác Đồ)**
- **Age-Based Timeline**: Vaccination schedule organized by age milestones
  - Newborn (sơ sinh)
  - Monthly milestones (2, 3, 4, 6, 9 months, etc.)
  - Yearly milestones (1, 2, 3+ years)
- **Antigen-Based View**: Schedule organized by vaccine type
- **Completion Tracking**: Visual indicators for completed vs. pending doses
- **Disease Information**: Educational content about each preventable disease
- **Dose Scheduling**: Recommended ages for each dose

### 4. **Personal Information Management**
- **Basic Information**: Name, date of birth, gender, ethnicity
- **Contact Details**: Phone number, email address
- **Address Information**:
  - Permanent address (Hộ khẩu)
  - Temporary address (Tạm trú)
- **Healthcare Facility**: Assigned healthcare center
- **Caregiver Information**: Details of designated caregivers

### 5. **Password Management**
- Three-step secure password reset:
  1. Request OTP via SMS
  2. Verify OTP code
  3. Set new password
- Clear progress indicators
- Form validation and error handling

---

## 🎨 Design Philosophy

### **Modern & Elegant**
- **Gradient Aesthetics**: Beautiful color gradients (blue → indigo → purple)
- **Glass-morphism Effects**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Icon-Driven Interface**: Lucide React icons for visual clarity

### **User-Centric**
- **Mobile-First Responsive**: Optimized for all screen sizes
- **Intuitive Navigation**: Clear visual hierarchy and logical flow
- **Accessibility**: High contrast, readable fonts, ARIA labels
- **Vietnamese Language**: Full localization for Vietnamese users

### **Visual Elements**
- **Color System**:
  - Primary: Blue (#3B82F6) - Trust, healthcare
  - Secondary: Indigo (#6366F1) - Technology, innovation
  - Accent: Purple (#8B5CF6) - Premium feel
  - Success: Emerald (#10B981) - Completed vaccinations
  - Warning: Amber (#F59E0B) - Pending actions
  - Danger: Red (#EF4444) - Errors, critical info

- **Typography**:
  - System font stack for optimal rendering
  - Clear hierarchy: Bold headings, medium body, light captions
  - Optimal line height and spacing

- **Spacing & Layout**:
  - Consistent 8px grid system
  - Generous whitespace for breathing room
  - Card-based layouts for content organization

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18**: Latest features including Concurrent Rendering
- **TypeScript**: Full type safety and developer experience
- **Vite**: Lightning-fast build tool and dev server
- **React Router v7**: Client-side routing with nested routes
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Modern icon library

### **State Management**
- **React Context API**: Authentication state management
- **Local Storage**: Persistent session storage
- **React Hooks**: useState, useEffect, useContext, useNavigate, etc.

### **API Integration**
- **Axios**: HTTP client with interceptors
- **Base URL**: `https://api-stc-v2.vncdc.gov.vn`
- **Authentication**: Bearer token in headers
- **Error Handling**: Comprehensive error messages and retry logic

### **API Endpoints**
```typescript
POST   /auth                           // Login authentication
GET    /thanh_vien?theo_doi=1          // Get member list
GET    /thanh_vien/:id                 // Get member details
GET    /lich_su_tiem/khang_nguyen      // Get antigen history
GET    /lich_su_tiem/vacxin            // Get vaccine history
GET    /phac_do_tiem_chung             // Get vaccination schedule
POST   /recover_pass_by_sms            // Request OTP
POST   /activate                       // Verify OTP
POST   /change_pass_by_token           // Change password
```

### **Type Safety**
Comprehensive TypeScript interfaces for:
- API requests and responses
- User data structures
- Vaccination records
- Authentication flow
- Component props

### **Component Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui-inspired components
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── skeleton.tsx
│   │   └── tabs.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/             # Page components
│   ├── Login.tsx
│   ├── ChangePassword.tsx
│   ├── PersonalInfo.tsx
│   └── VaccinationHistory.tsx
├── services/          # API services
│   └── api.ts
└── types/            # TypeScript definitions
    └── index.ts
```

---

## 🔒 Security Features

### **Authentication & Authorization**
- JWT-based authentication with Bearer tokens
- Secure token storage in localStorage
- Automatic token refresh handling
- Session expiration detection
- Logout on 401 errors

### **Data Protection**
- HTTPS-only communication
- No sensitive data in URLs
- Secure password transmission
- OTP-based password recovery

### **Input Validation**
- Client-side form validation
- Trim whitespace from inputs
- Phone number format validation
- Password strength requirements

---

## 📱 Progressive Web App (PWA)

### **PWA Features**
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Service worker with cache-first strategy
- **Fast Loading**: Optimized assets and lazy loading
- **Native Feel**: Standalone display mode

### **Service Worker Strategy**
- Network-first for API calls
- Cache-first for static assets
- Automatic cache cleanup
- Version-based cache management

### **Manifest Configuration**
```json
{
  "name": "Sổ Tiêm Chủng Điện Tử - VNCDC",
  "short_name": "Sổ Tiêm Chủng",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#ffffff"
}
```

---

## 🚀 Performance Optimization

### **Build Optimizations**
- Code splitting by route
- Tree shaking for unused code
- Asset compression (gzip/brotli)
- Image optimization
- CSS purging

### **Runtime Performance**
- Virtual scrolling for long lists
- Lazy loading of components
- Memoization of expensive computations
- Debounced search inputs
- Optimistic UI updates

### **Loading States**
- Skeleton screens during data fetch
- Loading spinners for actions
- Progressive content rendering
- Error boundaries for graceful failures

---

## 🌐 Deployment

### **Platform**: Cloudflare Pages
- **Benefits**:
  - Global CDN distribution
  - Automatic SSL certificates
  - Git-based deployments
  - Serverless edge functions
  - DDoS protection
  - Zero cold starts

### **Build Configuration**
```bash
Build command: npm run build
Output directory: dist
Node version: 18+
```

### **Environment**
- Production: Cloudflare Pages
- Development: Local Vite dev server
- Staging: Preview deployments on Cloudflare

---

## 📊 User Flows

### **First-Time User Journey**
1. **Landing**: Arrive at login page
2. **Authentication**: Enter phone number and password
3. **Dashboard**: View family members
4. **Explore**: Click on a member to see vaccination history
5. **Learn**: Browse through different tabs (overview, history, schedule)

### **Returning User Journey**
1. **Quick Login**: Auto-fill phone number
2. **Dashboard**: Immediately see member status
3. **Quick Access**: One-click to frequently viewed member
4. **Check Status**: Review recent vaccinations or upcoming schedules

### **Password Recovery Journey**
1. **Initiate**: Click "Forgot Password"
2. **Request OTP**: Enter phone number
3. **Verify**: Enter SMS OTP code
4. **Reset**: Set new password
5. **Success**: Redirect to login

---

## 🎯 Business Value

### **For Citizens**
- **Convenience**: 24/7 access to vaccination records
- **Transparency**: Complete visibility of vaccination history
- **Compliance**: Easy tracking of required vaccinations
- **Peace of Mind**: Know family is protected
- **Digital Records**: No more paper booklets

### **For Healthcare System**
- **Data Accuracy**: Centralized, accurate records
- **Efficiency**: Reduced administrative burden
- **Compliance**: Better vaccination coverage tracking
- **Public Health**: Support for vaccination campaigns
- **Analytics**: Data-driven health policy decisions

### **For VNCDC**
- **Digital Transformation**: Modern interface to legacy systems
- **User Adoption**: Beautiful UX encourages usage
- **Data Quality**: Structured, consistent data
- **Support Reduction**: Self-service reduces support load
- **Scalability**: Cloud-based platform handles growth

---

## 🔮 Future Enhancements

### **Phase 2 Features**
- [ ] Push notifications for upcoming vaccinations
- [ ] QR code generation for vaccination certificates
- [ ] Export vaccination records as PDF
- [ ] Multi-language support (English, ethnic languages)
- [ ] Dark mode toggle
- [ ] Biometric authentication (fingerprint, face ID)

### **Phase 3 Features**
- [ ] Appointment booking with healthcare facilities
- [ ] Integration with health insurance systems
- [ ] Vaccine recommendation engine based on age/risk
- [ ] Adverse reaction reporting
- [ ] Family sharing and permissions
- [ ] Healthcare provider portal

### **Technical Improvements**
- [ ] Offline-first architecture with sync
- [ ] End-to-end encryption for sensitive data
- [ ] GraphQL API for better data fetching
- [ ] React Native mobile apps
- [ ] AI-powered health insights

---

## 📈 Success Metrics

### **User Engagement**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Pages per session
- Return visitor rate

### **Performance**
- Page load time < 2s
- Time to interactive < 3s
- Lighthouse score > 90
- API response time < 500ms
- Error rate < 0.1%

### **Business Impact**
- User registration growth
- Vaccination record views
- Password recovery success rate
- Mobile vs. desktop usage
- User satisfaction (NPS score)

---

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Modern web browser
- Text editor (VS Code recommended)

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd tiem-chung

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Environment Variables**
No environment variables required - API base URL is hardcoded for simplicity and security (public API).

---

## 🤝 Contributing Guidelines

### **Code Style**
- TypeScript for all new code
- ESLint configuration must pass
- Tailwind CSS for styling (no inline styles)
- Component naming: PascalCase
- Function naming: camelCase
- File naming: PascalCase for components, camelCase for utilities

### **Git Workflow**
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test locally
4. Push and create pull request
5. Wait for review and CI checks
6. Merge after approval

### **Testing**
- Manual testing in Chrome, Safari, Firefox
- Mobile testing on iOS and Android
- Test all user flows
- Verify API error handling
- Check responsive design

---

## 📄 License

This project is developed for educational and demonstration purposes. All vaccination data belongs to VNCDC and is accessed through their official API.

---

## 📞 Support & Contact

### **For Users**
- VNCDC Hotline: [Insert hotline]
- Email: [Insert support email]
- Website: [Insert VNCDC website]

### **For Developers**
- GitHub Issues: [Repository issues]
- Documentation: [Link to docs]
- API Documentation: [VNCDC API docs]

---

## 🙏 Acknowledgments

- **VNCDC**: For providing the API and vaccination data
- **Vietnamese Government**: For supporting digital healthcare initiatives
- **Open Source Community**: For the amazing tools and libraries
- **Users**: For trusting us with their health information

---

**Version**: 1.0.0
**Last Updated**: October 25, 2025
**Maintained By**: Development Team

---

*Building a healthier Vietnam, one vaccination record at a time.* 💉❤️

