# Google Analytics & Tag Manager Setup Guide

## Overview

This application is configured to use both Google Analytics 4 (GA4) and Google Tag Manager (GTM) for comprehensive analytics tracking.

---

## Quick Setup

### Step 1: Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** (bottom left)
3. Click **Create Property**
4. Fill in property details:
   - **Property name**: Sổ Tiêm Chủng - VNCDC
   - **Reporting time zone**: (GMT+07:00) Bangkok, Hanoi, Jakarta
   - **Currency**: Vietnamese Dong (VND)
5. Click **Next** and complete setup
6. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### Step 2: Create Google Tag Manager Container

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Click **Create Account**
3. Fill in account details:
   - **Account Name**: VNCDC
   - **Country**: Vietnam
4. Fill in container setup:
   - **Container name**: Sổ Tiêm Chủng Web
   - **Target platform**: Web
5. Accept terms and create
6. Copy your **Container ID** (format: GTM-XXXXXXX)

### Step 3: Configure Application

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your IDs:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_GTM_ID=GTM-XXXXXXX
   ```

3. Restart development server:
   ```bash
   npm run dev
   ```

---

## What's Being Tracked

### Automatic Tracking

✅ **Page Views**
- Automatically tracks all page navigation
- Includes page path and title
- SPA-optimized (tracks client-side routing)

✅ **User Sessions**
- Session duration
- Pages per session
- Bounce rate

✅ **Device Information**
- Device type (mobile, desktop, tablet)
- Browser
- Screen resolution
- Operating system

### Custom Events (Implemented)

| Event | When Fired | Data Captured |
|-------|------------|---------------|
| `login` | User logs in | Login method |
| `logout` | User logs out | - |
| `view_member` | Member profile viewed | Member ID |
| `view_vaccination_history` | Vaccination history viewed | Member ID |
| `search` | User searches members | Search term, results count |
| `filter` | User applies filter | Filter type, value |
| `password_change` | Password change attempt | Success/failure |
| `error` | Application error | Error message, page |

### Where Events Are Triggered

**Login.tsx**
```typescript
import { trackLogin, trackError } from '../lib/analytics';

// On successful login
trackLogin('phone');

// On login error
trackError(errorMessage, 'login');
```

**PersonalInfo.tsx**
```typescript
import { trackSearch, trackFilter, trackMemberView } from '../lib/analytics';

// On search
trackSearch(searchQuery, results.length);

// On filter
trackFilter('sort', sortOption);

// On member click
trackMemberView(member.doi_tuong_id.toString());
```

**VaccinationHistory.tsx**
```typescript
import { trackVaccinationHistoryView } from '../lib/analytics';

// On page load
trackVaccinationHistoryView(memberId);
```

**ChangePassword.tsx**
```typescript
import { trackPasswordChange } from '../lib/analytics';

// On password change
trackPasswordChange(success);
```

---

## Advanced Configuration

### Google Analytics 4 (GA4)

#### Recommended Reports

1. **Realtime Overview**: See live user activity
2. **Engagement → Pages and screens**: Most viewed pages
3. **User → Demographics**: Age, gender, location
4. **Acquisition → Traffic acquisition**: Where users come from
5. **Engagement → Events**: Custom event tracking

#### Custom Dimensions (Optional)

Add these in GA4 Admin → Custom Definitions:

| Dimension Name | Scope | Description |
|----------------|-------|-------------|
| user_type | User | authenticated/guest |
| member_count | User | Number of members managed |
| device_type | Event | mobile/desktop/tablet |

#### Enhanced Measurement

Enable in GA4 Admin → Data Streams → Web → Enhanced Measurement:

✅ Page views (already enabled by default)
✅ Scrolls
✅ Outbound clicks
✅ Site search
✅ Video engagement
✅ File downloads

### Google Tag Manager (GTM)

#### Recommended Tags

**1. Google Analytics 4 Configuration**
- Tag Type: Google Analytics: GA4 Configuration
- Measurement ID: {{ GA Measurement ID }}
- Trigger: All Pages

**2. Facebook Pixel** (if needed)
- Tag Type: Custom HTML
- Pixel ID: Your Facebook Pixel ID
- Trigger: All Pages

**3. Conversion Tracking**
- Tag Type: Google Analytics: GA4 Event
- Event Name: conversion
- Trigger: Custom event (e.g., form_submit)

#### Built-in Variables to Enable

- Click Element
- Click Classes
- Click ID
- Click Target
- Click Text
- Click URL
- Form Element
- Form Classes
- Form ID
- Form Target
- Form Text

#### Custom Triggers

**Form Submit**
- Trigger Type: Form Submission
- Form ID: login-form, password-form
- Trigger: Form Submission

**Scroll Depth**
- Trigger Type: Scroll Depth
- Percentages: 25, 50, 75, 90, 100
- Trigger: Window Loaded

**Member View**
- Trigger Type: Custom Event
- Event Name: view_member
- Use regex matching: false

---

## Testing

### Verify Installation

1. **Google Analytics Debugger Extension**
   - Install: [GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
   - Enable debugger
   - Navigate your site
   - Check console for GA events

2. **GTM Preview Mode**
   - In GTM, click **Preview**
   - Enter your site URL
   - A debug panel will appear
   - See which tags fire on each page

3. **Real-time Reports**
   - Go to GA4 → Reports → Realtime
   - Navigate your site
   - See events appear in real-time

### Test Events Manually

Open browser console and run:

```javascript
// Test page view
window.gtag('event', 'page_view', {
  page_path: '/test',
  page_title: 'Test Page'
});

// Test custom event
window.dataLayer.push({
  event: 'test_event',
  eventCategory: 'test',
  eventLabel: 'manual_test'
});
```

---

## Privacy & GDPR Compliance

### Implemented Features

✅ **Anonymize IP**: Enabled by default
✅ **Cookie Flags**: SameSite=None;Secure
✅ **No PII**: No personally identifiable information tracked
✅ **Opt-out Ready**: Easy to add cookie consent

### Add Cookie Consent (Optional)

Install a cookie consent library:

```bash
npm install react-cookie-consent
```

Add to App.tsx:

```typescript
import CookieConsent from "react-cookie-consent";

function App() {
  return (
    <>
      <Router>
        {/* ...existing code... */}
      </Router>
      
      <CookieConsent
        location="bottom"
        buttonText="Chấp nhận"
        declineButtonText="Từ chối"
        enableDeclineButton
        onAccept={() => {
          // Enable analytics
          window.gtag?.('consent', 'update', {
            'analytics_storage': 'granted'
          });
        }}
        onDecline={() => {
          // Disable analytics
          window.gtag?.('consent', 'update', {
            'analytics_storage': 'denied'
          });
        }}
      >
        Website này sử dụng cookies để cải thiện trải nghiệm người dùng.
      </CookieConsent>
    </>
  );
}
```

---

## Monitoring & Optimization

### Key Metrics to Watch

| Metric | Target | Action if Below |
|--------|--------|----------------|
| Session Duration | > 3 min | Improve content engagement |
| Bounce Rate | < 40% | Improve landing page |
| Pages/Session | > 3 | Add internal links |
| Event Tracking | > 80% success | Fix implementation |
| Mobile Traffic | > 50% | Prioritize mobile UX |

### Weekly Review Checklist

- [ ] Check real-time users
- [ ] Review top pages
- [ ] Analyze user flow
- [ ] Check error events
- [ ] Review conversion funnel
- [ ] Monitor load times
- [ ] Check device breakdown
- [ ] Review search terms

---

## Troubleshooting

### Analytics Not Tracking

1. **Check IDs**: Verify `.env` file has correct IDs
2. **Check Console**: Look for errors in browser console
3. **Clear Cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. **Verify Script**: Check index.html has correct scripts
5. **Test in Incognito**: Ad blockers may interfere

### Events Not Showing

1. **Wait 24-48 hours**: GA4 can have delays
2. **Check Real-time**: See if events show in real-time reports
3. **Debug Mode**: Enable GA Debugger extension
4. **Check Code**: Verify event names match exactly
5. **GTM Preview**: Use GTM preview mode to debug

### Common Errors

**Error**: `gtag is not defined`
**Solution**: GA script not loaded, check index.html

**Error**: `dataLayer is not defined`
**Solution**: GTM script not loaded, check index.html

**Error**: No data in reports
**Solution**: Wait 24-48 hours, check filters, verify tracking ID

---

## Resources

### Documentation
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GTM Documentation](https://developers.google.com/tag-manager)
- [Analytics.js Migration](https://developers.google.com/analytics/devguides/collection/gtagjs/migration)

### Tools
- [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)
- [Tag Assistant](https://tagassistant.google.com/)
- [Analytics Academy](https://analytics.google.com/analytics/academy/)

### Community
- [GA4 Community](https://www.en.advertisercommunity.com/t5/Google-Analytics-4/bd-p/GoogleAnalytics4)
- [GTM Community](https://www.en.advertisercommunity.com/t5/Tag-Manager/bd-p/TagManager)
- [Stack Overflow - GA4](https://stackoverflow.com/questions/tagged/google-analytics-4)

---

## Support

For issues with analytics setup:
1. Check this guide first
2. Review GA4/GTM documentation
3. Test with debugger tools
4. Contact analytics team

**Last Updated**: October 25, 2025
**Version**: 1.0

