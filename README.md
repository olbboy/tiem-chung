# Sổ Tiêm Chủng - Vaccination Portal WebApp

Web application for viewing vaccination records from the Vietnamese National Center for Disease Control (VNCDC).

## Features

- **User Authentication**: Login using phone number and password
- **Personal Information**: View list of members under your account
- **Vaccination History**: Detailed vaccination records for each member
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/        # Reusable components
│   └── ProtectedRoute.tsx
├── contexts/          # React context providers
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Login.tsx
│   ├── PersonalInfo.tsx
│   └── VaccinationHistory.tsx
├── services/         # API services
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component with routing
└── main.tsx         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The application integrates with the VNCDC API endpoints:

- **Authentication**: `POST /auth`
- **Member List**: `GET /thanh_vien?theo_doi=1`
- **Member Details**: `GET /thanh_vien/:id`
- **Vaccination History**: `GET /lich_su_tiem/khang_nguyen?doi_tuong_id=:id`

All API calls include proper headers as required by the VNCDC API.

## Usage

1. **Login**: Enter your phone number and password
2. **View Members**: See all members linked to your account
3. **View History**: Click on any member to see their vaccination records

## Security

- JWT tokens are stored in localStorage
- Protected routes require authentication
- API calls include all necessary security headers

## Development

The project uses TypeScript for type safety and includes:
- Type definitions for all API responses
- Protected route components
- Authentication context for state management
- Axios service layer with automatic token handling

## Deployment to Cloudflare Pages

### Quick Setup (Recommended)

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Deploy command**: **LEAVE EMPTY** (very important!)
   - **Root directory**: Leave empty
3. Click "Save and Deploy"

**⚠️ IMPORTANT**: Do NOT set a deploy command. Cloudflare Pages automatically deploys after the build completes.

### Troubleshooting

If you see error: `It looks like you've run a Workers-specific command in a Pages project`
- Go to Settings → Builds & deployments
- Remove/clear the "Deploy command" field
- Retry deployment

For detailed deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Important Configuration Files

- `public/_redirects` - Handles SPA routing (redirects all routes to index.html)

The `_redirects` file ensures that client-side routing works correctly on Cloudflare Pages.

## License

This project is for educational and demonstration purposes.
